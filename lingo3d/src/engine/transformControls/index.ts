import { createEffect } from "@lincode/reactivity"
import {
    emitTransformControls,
    onTransformControls,
    TransformControlsMode,
    TransformControlsPhase
} from "../../events/onTransformControls"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsSnap } from "../../states/useTransformControlsSnap"
import { container } from "../renderLoop/renderSetup"
import scene from "../scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import { setTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsSpaceComputed } from "../../states/useTransformControlsSpaceComputed"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { ssrExcludeSet } from "../renderLoop/effectComposer/ssrEffect/renderSetup"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { CM2M } from "../../globals"
import { deg2Rad } from "@lincode/math"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"

const lazyTransformControls = lazy(async () => {
    const { TransformControls } = await import("./TransformControls")
    const transformControls = new TransformControls(
        getCameraRendered(),
        container
    )
    //@ts-ignore
    getCameraRendered((camera) => (transformControls.camera = camera))
    //@ts-ignore
    transformControls.enabled = false

    let dragging = false
    transformControls.addEventListener("dragging-changed", ({ value }) => {
        dragging = value
        setTransformControlsDragging(dragging)
        emitTransformControls(dragging ? "start" : "end")
    })
    transformControls.addEventListener(
        "change",
        () => dragging && emitTransformControls("move")
    )
    return transformControls
})

createEffect(() => {
    const selectionTarget = getSelectionTarget()
    const target =
        getSelectionNativeTarget() ??
        (selectionTarget && "outerObject3d" in selectionTarget
            ? selectionTarget.outerObject3d
            : undefined)

    if (!target) return

    const _mode = getEditorModeComputed()
    const mode = _mode === "curve" ? "translate" : _mode
    if (mode !== "translate" && mode !== "rotate" && mode !== "scale") return

    const space = getTransformControlsSpaceComputed()
    const snap = !getTransformControlsSnap()

    const handle = new Cancellable()
    lazyTransformControls().then((transformControls) => {
        if (handle.done || !target.parent) return

        transformControls.setMode(mode)
        transformControls.setSpace(space)
        transformControls.setScaleSnap(snap ? 10 * CM2M : null)
        transformControls.setRotationSnap(snap ? 15 * deg2Rad : null)
        transformControls.setTranslationSnap(snap ? 10 * CM2M : null)

        scene.add(transformControls)
        transformControls.attach(target)
        //@ts-ignore
        transformControls.enabled = true

        ssrExcludeSet.add(transformControls)

        handle.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            //@ts-ignore
            transformControls.enabled = false
            ssrExcludeSet.delete(transformControls)
        })
    })

    const callbacks: Array<
        (phase: TransformControlsPhase, mode: TransformControlsMode) => void
    > = []
    target.userData.onTransformControls &&
        callbacks.push(target.userData.onTransformControls)

    for (const target of getMultipleSelectionTargets()[0])
        target.userData.onTransformControls &&
            callbacks.push(target.userData.onTransformControls)

    const handle1 = onTransformControls((phase) => {
        for (const cb of callbacks) cb(phase, mode)
    })
    return () => {
        handle.cancel()
        handle1.cancel()
    }
}, [
    getSelectionTarget,
    getSelectionNativeTarget,
    getEditorModeComputed,
    getTransformControlsSpaceComputed,
    getTransformControlsSnap
])
