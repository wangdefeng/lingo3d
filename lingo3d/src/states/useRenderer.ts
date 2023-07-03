import store, { createEffect } from "@lincode/reactivity"
import { PCFSoftShadowMap, WebGLRenderer } from "three"
import { getBackgroundColor } from "./useBackgroundColor"
import { rendererPtr } from "../pointers/rendererPtr"
import { getSplitView } from "./useSplitView"
import { dynamicResolutionSystem } from "../systems/dynamicResolutionSystem"
import { getFileCurrent } from "./useFileCurrent"
import { getFps } from "./useFps"
import { getResolution } from "./useResolution"

const [setRenderer, getRenderer] = store<WebGLRenderer | undefined>(undefined)
export { getRenderer }

createEffect(() => {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        precision: "lowp",
        ...(!getSplitView() && {
            antialias: false,
            stencil: false,
            depth: false
        }),
        alpha: getBackgroundColor() === "transparent"
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    setRenderer((rendererPtr[0] = renderer))

    return () => {
        renderer.dispose()
    }
}, [getBackgroundColor, getSplitView])

createEffect(() => {
    const [renderer] = rendererPtr
    dynamicResolutionSystem.add(renderer)

    return () => {
        dynamicResolutionSystem.delete(renderer)
    }
}, [getFps, getRenderer, getResolution, getFileCurrent])
