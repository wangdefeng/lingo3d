import store, { createEffect } from "@lincode/reactivity"
import { getAntiAlias } from "./useAntiAlias"
import { getPixelRatio } from "./usePixelRatio"

const [setPixelRatioComputed, getPixelRatioComputed] = store(1)
export { getPixelRatioComputed }

createEffect(() => {
    setPixelRatioComputed(
        getPixelRatio() ?? (getAntiAlias() === "SSAA" && devicePixelRatio > 1)
            ? 1.5
            : 1
    )
}, [getAntiAlias, getPixelRatio])
