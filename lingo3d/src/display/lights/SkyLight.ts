import { Color, HemisphereLight } from "three"
import LightBase, { mapShadowResolution } from "../core/LightBase"
import ISkyLight, {
    skyLightDefaults,
    skyLightSchema
} from "../../interface/ISkyLight"
import { Reactive } from "@lincode/reactivity"
import { CSM } from "three/examples/jsm/csm/CSM"
import scene from "../../engine/scene"
import { getCameraRendered } from "../../states/useCameraRendered"
import {
    getShadowDistance,
    ShadowDistance
} from "../../states/useShadowDistance"
import {
    getShadowResolution,
    ShadowResolution
} from "../../states/useShadowResolution"
import DirectionalLight from "./DirectionalLight"
import { eraseAppendable } from "../../api/core/collections"
import { assertExhaustive } from "@lincode/utils"
import renderSystemWithData from "../../utils/renderSystemWithData"

const [addLightSystem, deleteLightSystem] = renderSystemWithData(
    (self: SkyLight, data: { csm: CSM }) => {
        const lightDirection = self.position
            .clone()
            .normalize()
            .multiplyScalar(-1)

        data.csm.lightDirection = lightDirection
        data.csm.update()
    }
)

const mapCSMOptions = (
    shadowDistance: ShadowDistance,
    shadowResolution: ShadowResolution
) => {
    switch (shadowDistance) {
        case "near":
            return {
                maxFar: 10,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.00003
            }
        case "medium":
            return {
                maxFar: 30,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.0001
            }
        case "far":
            return {
                maxFar: 100,
                shadowMapSize: mapShadowResolution(shadowResolution) * 2,
                shadowBias: -0.0001
            }
        default:
            assertExhaustive(shadowDistance)
    }
}

export default class SkyLight
    extends LightBase<typeof HemisphereLight>
    implements ISkyLight
{
    public static componentName = "skyLight"
    public static defaults = skyLightDefaults
    public static schema = skyLightSchema

    public constructor() {
        super(HemisphereLight)

        this.createEffect(() => {
            if (!this.castShadowState.get()) {
                const directionalLight = new DirectionalLight()
                directionalLight.intensity = 0.5
                this.append(directionalLight)
                eraseAppendable(directionalLight)
                const handle = this.helperState.get(
                    (val) => (directionalLight.helper = val)
                )
                return () => {
                    directionalLight.dispose()
                    handle.cancel()
                }
            }

            const csm = new CSM({
                ...mapCSMOptions(
                    this.shadowDistanceState.get() ?? getShadowDistance(),
                    this.shadowResolutionState.get() ?? getShadowResolution()
                ),
                cascades: 1,
                parent: scene,
                camera: getCameraRendered(),
                lightIntensity: 0.5
            })

            addLightSystem(this, { csm })
            const handle = getCameraRendered((val) => (csm.camera = val))
            return () => {
                deleteLightSystem(this)
                handle.cancel()
                csm.dispose()
                for (const light of csm.lights) {
                    light.dispose()
                    scene.remove(light)
                }
            }
        }, [
            this.castShadowState.get,
            this.shadowDistanceState.get,
            getShadowDistance,
            getShadowResolution
        ])
    }

    private shadowDistanceState = new Reactive<ShadowDistance | undefined>(
        undefined
    )
    public get shadowDistance() {
        return this.shadowDistanceState.get()
    }
    public set shadowDistance(val) {
        this.shadowDistanceState.set(val)
    }

    public get groundColor() {
        const light = this.lightState.get()
        if (!light) return "#ffffff"

        return "#" + light.groundColor.getHexString()
    }
    public set groundColor(val) {
        this.cancelHandle("groundColor", () =>
            this.lightState.get(
                (light) => light && (light.groundColor = new Color(val))
            )
        )
    }
}
