import { Reactive } from "@lincode/reactivity"
import scene from "../../engine/scene"
import { onRender } from "../../events/onRender"
import { reflectorDefaults, reflectorSchema } from "../../interface/IReflector"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getRenderer } from "../../states/useRenderer"
import copyStandard from "../core/StaticObjectManager/applyMaterialProperties/copyStandard"
import Plane from "../primitives/Plane"

export default class Reflector extends Plane {
    public static override componentName = "reflector"
    public static override defaults = reflectorDefaults
    public static override schema = reflectorSchema

    public constructor() {
        super()
        this.rotationX = -90

        import("./MeshReflectorMaterial").then((module) => {
            this.createEffect(() => {
                const renderer = getRenderer()
                if (!renderer || this.done) return

                const camera = getCameraRendered()

                const MeshReflectorMaterial = module.default
                const mat = new MeshReflectorMaterial(
                    renderer,
                    camera,
                    scene,
                    this.object3d,
                    {
                        resolution: this.resolutionState.get(),
                        blur: [this.blurState.get(), this.blurState.get()],
                        mixBlur: 2.5,
                        mixContrast: this.contrastState.get(),
                        mirror: this.mirrorState.get(),
                        distortionMap: undefined
                    }
                )
                copyStandard(this.material, mat)
                this.material.dispose()
                this.material = this.object3d.material = mat

                const handle = onRender(() => {
                    camera.updateWorldMatrix(true, false)
                    mat.update()
                })
                return () => {
                    mat.dispose()
                    handle.cancel()
                }
            }, [
                getRenderer,
                getCameraRendered,
                this.resolutionState.get,
                this.blurState.get,
                this.contrastState.get,
                this.mirrorState.get
            ])
        })
    }

    private resolutionState = new Reactive(256)
    public get resolution() {
        return this.resolutionState.get()
    }
    public set resolution(val) {
        this.resolutionState.set(val)
    }

    private blurState = new Reactive(512)
    public get blur() {
        return this.blurState.get()
    }
    public set blur(val) {
        this.blurState.set(val)
    }

    private contrastState = new Reactive(1.5)
    public get contrast() {
        return this.contrastState.get()
    }
    public set contrast(val) {
        this.contrastState.set(val)
    }

    private mirrorState = new Reactive(1)
    public get mirror() {
        return this.mirrorState.get()
    }
    public set mirror(val) {
        this.mirrorState.set(val)
    }
}
