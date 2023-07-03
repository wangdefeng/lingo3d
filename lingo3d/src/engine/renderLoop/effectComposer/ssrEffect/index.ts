import store, { createEffect } from "@lincode/reactivity"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getSSR } from "../../../../states/useSSR"
import { getSSRIntensity } from "../../../../states/useSSRIntensity"
import { getSSRJitter } from "../../../../states/useSSRJitter"
import unsafeSetValue from "../../../../utils/unsafeSetValue"
import scene from "../../../scene"
import { SSREffect } from "./SSREffect"
import { cameraRenderedPtr } from "../../../../pointers/cameraRenderedPtr"

const [setSSREffect, getSSREffect] = store<SSREffect | undefined>(undefined)
export { getSSREffect }

createEffect(() => {
    if (!getSSR()) return

    const effect = new SSREffect(scene, cameraRenderedPtr[0])
    setSSREffect(effect)

    const handle0 = getSSRIntensity((val) =>
        unsafeSetValue(effect, "intensity", val)
    )
    const handle1 = getSSRJitter((val) => unsafeSetValue(effect, "jitter", val))

    return () => {
        setSSREffect(undefined)
        effect.dispose()
        handle0.cancel()
        handle1.cancel()
    }
}, [getSSR, getCameraRendered])
