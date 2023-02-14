import { createEffect } from "@lincode/reactivity"
import { EquirectangularReflectionMapping } from "three"
import Environment from "../display/Environment"
import loadTexture from "../display/utils/loaders/loadTexture"
import { environmentPreset } from "../interface/IEnvironment"
import { getEnvironment } from "../states/useEnvironment"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import scene from "./scene"
import { appendableRoot } from "../api/core/collections"
import unsafeGetValue from "../utils/unsafeGetValue"
import { TEXTURES_URL } from "../api/assetsPath"
import("../display/lights/DefaultSkyLight")

const defaultEnvironment = new Environment()
defaultEnvironment.texture = undefined
defaultEnvironment.helper = false
appendableRoot.delete(defaultEnvironment)

export const environmentToUrl = (value: string) =>
    value in environmentPreset
        ? TEXTURES_URL() + unsafeGetValue(environmentPreset, value)
        : value

createEffect(() => {
    const environment = getEnvironmentStack().at(-1)
    const renderer = getRenderer()

    if (!environment?.texture || !renderer) return

    let proceed = true
    const texture = loadTexture(
        environmentToUrl(environment.texture),
        () => proceed && (scene.environment = texture)
    )
    texture.mapping = EquirectangularReflectionMapping

    return () => {
        proceed = false
        scene.environment = null
    }
}, [getEnvironmentStack, getRenderer])

createEffect(() => {
    const environment = getEnvironment()
    if (!environment) return

    defaultEnvironment.texture = environment
    return () => {
        defaultEnvironment.texture = undefined
    }
}, [getEnvironment])
