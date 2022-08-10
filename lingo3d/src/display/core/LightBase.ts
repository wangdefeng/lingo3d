import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { Class } from "@lincode/utils"
import { Color, Group, Light, Object3D } from "three"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../events/onSelectionTarget"
import ILightBase from "../../interface/ILightBase"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getShadowResolution } from "../../states/useShadowResolution"
import ObjectManager from "./ObjectManager"
import makeLightSprite from "./utils/makeLightSprite"

export default abstract class LightBase<T extends typeof Light>
    extends ObjectManager<Group>
    implements ILightBase
{
    protected lightState = new Reactive<InstanceType<T> | undefined>(undefined)

    protected defaultShadowResolution = 512

    public constructor(
        Light: T,
        Helper?: Class<Object3D & { dispose: () => void }>
    ) {
        const group = new Group()
        super(group)

        this.createEffect(() => {
            const light = new Light()
            this.lightState.set(light as InstanceType<T>)
            group.add(light)

            if (light.shadow) {
                const shadowResolution =
                    this.shadowResolutionState.get() ??
                    getShadowResolution() ??
                    this.defaultShadowResolution

                light.castShadow = true
                light.shadow.bias = -0.0005
                // light.shadow.bias = -0.00009
                light.shadow.mapSize.width = shadowResolution
                light.shadow.mapSize.height = shadowResolution
                light.shadow.radius = 2
            }
            return () => {
                group.remove(light)
                light.dispose()
            }
        }, [this.shadowResolutionState.get, getShadowResolution])

        this.createEffect(() => {
            const light = this.lightState.get()
            if (
                getCameraRendered() !== mainCamera ||
                !this.helperState.get() ||
                !light
            )
                return

            const handle = new Cancellable()

            const sprite = makeLightSprite()
            handle.watch(
                onSelectionTarget(({ target }) => {
                    target === sprite && emitSelectionTarget(this)
                })
            )

            if (Helper) {
                const helper = new Helper(light)
                scene.add(helper)
                helper.add(sprite.outerObject3d)

                if ("update" in helper)
                    handle.watch(
                        onBeforeRender(() => {
                            //@ts-ignore
                            helper.update()
                        })
                    )

                handle.then(() => {
                    helper.dispose()
                    scene.remove(helper)
                })
            } else this.outerObject3d.add(sprite.outerObject3d)

            return () => {
                sprite.dispose()
                handle.cancel()
            }
        }, [getCameraRendered, this.helperState.get, this.lightState.get])
    }

    private helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    private shadowResolutionState = new Reactive<number | undefined>(undefined)
    public get shadowResolution() {
        return this.shadowResolutionState.get()
    }
    public set shadowResolution(val) {
        this.shadowResolutionState.set(val)
    }

    public get color() {
        const light = this.lightState.get()
        if (!light) return "#ffffff"

        return "#" + light.color.getHexString()
    }
    public set color(val) {
        this.cancelHandle("color", () =>
            this.lightState.get(
                (light) => light && (light.color = new Color(val))
            )
        )
    }

    public get intensity() {
        const light = this.lightState.get()
        if (!light) return 1

        return light.intensity
    }
    public set intensity(val) {
        this.cancelHandle("intensity", () =>
            this.lightState.get((light) => light && (light.intensity = val))
        )
    }
}
