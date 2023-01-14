import { Point3d } from "@lincode/math"
import store, { createEffect, createMemo, createRef } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import StaticObjectManager from "../display/core/StaticObjectManager"
import { raycast } from "../display/core/StaticObjectManager/raycast/pickable"
import selectionCandidates, {
    unselectableSet
} from "../display/core/StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "../display/core/utils/HelperSphere"
import clientToWorld from "../display/utils/clientToWorld"
import normalizeClientPosition from "../display/utils/normalizeClientPosition"
import { emitSelectionTarget } from "../events/onSelectionTarget"

export const [setEditorDragEvent, getEditorDragEvent] = store<
    | DragEvent
    | ((hitManager?: Appendable) => Appendable | undefined)
    | undefined
>(undefined)

createEffect(() => {
    const e = getEditorDragEvent()
    const pointRef = createRef<Point3d>({ x: 0, y: 0, z: 0 })
    const hitManagerRef = createRef<StaticObjectManager | undefined>()

    const isDragEvent = e instanceof DragEvent
    const indicator = createMemo(() => {
        if (!isDragEvent) return
        const indicator = new HelperSphere()
        unselectableSet.add(indicator.object3d)
        return indicator
    }, [isDragEvent])

    if (typeof e === "function") {
        const manager = e(hitManagerRef.current)
        if (!manager) return
        Object.assign(manager, pointRef.current)
        emitSelectionTarget(manager)
        return
    }

    if (!isDragEvent || !indicator) return

    const [xNorm, yNorm] = normalizeClientPosition(e.clientX, e.clientY)
    const hit = raycast(xNorm, yNorm, selectionCandidates)
    hitManagerRef.current = hit?.manager
    const point = hit?.point ?? clientToWorld(e.clientX, e.clientY)
    Object.assign(indicator, point)
    pointRef.current = point

    return () => {
        !(getEditorDragEvent() instanceof DragEvent) && indicator.dispose()
    }
}, [getEditorDragEvent])
