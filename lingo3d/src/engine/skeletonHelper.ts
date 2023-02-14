import { createEffect } from "@lincode/reactivity"
import { SkeletonHelper } from "three"
import Loaded from "../display/core/Loaded"
import { skinnedMeshSet } from "../display/utils/cloneSkinnedMesh"
import { getEditorHelper } from "../states/useEditorHelper"
import { getSelectionTarget } from "../states/useSelectionTarget"
import scene from "./scene"

createEffect(() => {
    const target = getSelectionTarget()
    if (!(target instanceof Loaded) || !getEditorHelper()) return

    const { loadedObject3d } = target
    if (!loadedObject3d || !skinnedMeshSet.has(loadedObject3d)) return

    const helper = new SkeletonHelper(loadedObject3d)
    scene.add(helper)

    return () => {
        scene.remove(helper)
    }
}, [getSelectionTarget, getEditorHelper])
