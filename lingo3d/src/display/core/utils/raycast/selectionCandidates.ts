import { Cancellable } from "@lincode/promiselikes"
import { throttleTrailing } from "@lincode/utils"
import { Object3D } from "three"
import Appendable from "../../../../api/core/Appendable"
import { appendableRoot } from "../../../../api/core/collections"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import {
    onSelectionTarget,
    emitSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"
import { StandardMesh } from "../../mixins/TexturedStandardMixin"
import VisibleMixin from "../../mixins/VisibleMixin"
import HelperPrimitive from "../HelperPrimitive"
import HelperSprite from "../HelperSprite"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const unselectableSet = new WeakSet<Object3D>()
export const additionalSelectionCandidates = new Set<Object3D>()
export const overrideSelectionCandidates = new Set<Object3D>()

export const addSelectionHelper = (
    helper: HelperSprite | HelperPrimitive,
    manager: MeshAppendable
) => {
    helper.target = manager

    manager.outerObject3d.add(helper.outerObject3d)
    additionalSelectionCandidates.add(helper.object3d)

    const handle = onSelectionTarget(
        ({ target }) => target === helper && emitSelectionTarget(manager)
    )
    return new Cancellable(() => {
        helper.dispose()
        additionalSelectionCandidates.delete(helper.object3d)
        handle.cancel()
    })
}

const traverse = (
    targets: Array<Appendable | VisibleMixin> | Set<Appendable | VisibleMixin>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager)) continue

        if (
            "addToRaycastSet" in manager &&
            !unselectableSet.has(manager.object3d)
        )
            manager.addToRaycastSet(selectionCandidates)

        manager.children && traverse(manager.children, frozenSet)
    }
}

export const getSelectionCandidates = throttleTrailing(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        selectionCandidates.clear()
        const selectionFocus = getSelectionFocus()
        if (selectionFocus) {
            if (selectionFocus instanceof MeshAppendable)
                selectionFocus.outerObject3d.traverse(
                    (child: Object3D | StandardMesh) =>
                        "material" in child &&
                        child.material.userData.TextureManager &&
                        selectionCandidates.add(child)
                )
            return
        }
        if (overrideSelectionCandidates.size) {
            for (const candidate of overrideSelectionCandidates)
                selectionCandidates.add(candidate)
            return
        }
        const [frozenSet] = getSelectionFrozen()
        traverse(targets, frozenSet)
        for (const candidate of additionalSelectionCandidates)
            selectionCandidates.add(candidate)
    }
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget(undefined)
})
