import { createEffect } from "@lincode/reactivity"
import { SkeletonHelper } from "three"
import Loaded from "../display/core/Loaded"
import { getSelectionTarget } from "../states/useSelectionTarget"
import scene from "./scene"
import { skinnedMeshSet } from "../collections/skinnedMeshSet"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

createEffect(() => {
    const [target] = selectionTargetPtr
    if (
        !(target instanceof Loaded) ||
        !("outerObject3d" in target) ||
        !target.outerObject3d.parent
    )
        return

    const { $loadedObject3d: loadedObject3d } = target
    if (!loadedObject3d || !skinnedMeshSet.has(loadedObject3d)) return

    const helper = new SkeletonHelper(loadedObject3d)
    scene.add(helper)

    return () => {
        scene.remove(helper)
        helper.dispose()
    }
}, [getSelectionTarget])
