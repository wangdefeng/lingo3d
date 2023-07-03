import { spotLightPool } from "../../pools/objectPools/spotLightPool"
import IPooledSpotLight, {
    pooledSpotLightDefaults,
    pooledSpotLightSchema
} from "../../interface/IPooledSpotLight"
import SpotLight from "./SpotLight"
import { onSpotLightPool } from "../../events/onSpotLightPool"
import { spotLightPoolPtr } from "../../pointers/spotLightPoolPtr"
import PooledPointLightBase from "../core/PooledPointLightBase"
import { pooledSpotLightSystem } from "../../systems/pooledSpotLightSystem"

const lightSet = new Set<PooledSpotLight>()

let requested: PooledSpotLight | undefined
const requestSpotLights = (self: PooledSpotLight) => {
    if (requested) return
    requested = self
    const lights: Array<SpotLight> = []
    for (let i = 0; i < spotLightPoolPtr[0]; ++i)
        lights.push(spotLightPool.request([], "", self))
    for (const light of lights) spotLightPool.release(light)
}
onSpotLightPool(() => {
    if (!requested) return
    const self = requested
    requested = undefined
    spotLightPool.clear()
    requestSpotLights(self)
    for (const light of lightSet) pooledSpotLightSystem.add(light)
})

export default class PooledSpotLight
    extends PooledPointLightBase<SpotLight>
    implements IPooledSpotLight
{
    public static componentName = "pooledSpotLight"
    public static defaults = pooledSpotLightDefaults
    public static schema = pooledSpotLightSchema

    public constructor() {
        super()
        requestSpotLights(this)
        pooledSpotLightSystem.add(this)
        lightSet.add(this)
        this.then(() => lightSet.delete(this))
    }

    private _angle = 45
    public get angle() {
        return this._angle
    }
    public set angle(value) {
        this._angle = value
        if (this.$light) this.$light.angle = value
    }

    private _penumbra = 0.2
    public get penumbra() {
        return this._penumbra
    }
    public set penumbra(value) {
        this._penumbra = value
        if (this.$light) this.$light.penumbra = value
    }

    private _volumetric = false
    public get volumetric() {
        return this._volumetric
    }
    public set volumetric(value) {
        this._volumetric = value
        if (this.$light) this.$light.volumetric = value
    }

    private _volumetricDistance = 1
    public get volumetricDistance() {
        return this._volumetricDistance
    }
    public set volumetricDistance(value) {
        this._volumetricDistance = value
        if (this.$light) this.$light.volumetricDistance = value
    }
}
