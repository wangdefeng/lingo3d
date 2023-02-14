import { Point } from "@lincode/math"
import { filter } from "@lincode/utils"
import { DoubleSide, Sprite, SpriteMaterial } from "three"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "../../../interface/ITexturedBasic"
import getDefaultValue from "../../../interface/utils/getDefaultValue"
import throttleSystem from "../../../utils/throttleSystem"
import { color } from "../../utils/reusables"
import createInstancePool from "../utils/createInstancePool"
import filterNotDefault from "./utils/filterNotDefault"
import createMap from "./utils/createMap"
import MeshAppendable from "../../../api/core/MeshAppendable"

type Params = [
    color: string,
    opacity: number,
    texture: string,
    alphaMap: string,
    textureRepeat: number | Point,
    textureFlipY: boolean,
    textureRotation: number
]

const [increaseCount, decreaseCount] = createInstancePool<
    SpriteMaterial,
    Params
>(
    (_, params) =>
        new SpriteMaterial(
            filter(
                {
                    side: DoubleSide,
                    color: params[0],
                    opacity: params[1],
                    transparent: true,
                    // transparent: params[1] !== undefined && params[1] < 1,
                    map: createMap(params[2], params[4], params[5], params[6]),
                    alphaMap: createMap(
                        params[3],
                        params[4],
                        params[5],
                        params[6]
                    )
                },
                filterNotDefault
            )
        ),
    (material) => material.dispose()
)

const refreshParamsSystem = throttleSystem((target: TexturedSpriteMixin) => {
    if (target.materialParamString)
        decreaseCount(SpriteMaterial, target.materialParamString)
    else
        target.then(() =>
            decreaseCount(SpriteMaterial, target.materialParamString!)
        )
    const paramString = JSON.stringify(target.materialParams)
    target.material = increaseCount(
        SpriteMaterial,
        target.materialParams,
        paramString
    )
    target.materialParamString = paramString
})

const defaults = Object.fromEntries(
    Object.entries(texturedBasicSchema).map(([key]) => [
        key,
        structuredClone(getDefaultValue(texturedBasicDefaults, key, true))
    ])
)
const defaultParams = Object.values(defaults) as Params

export default abstract class TexturedSpriteMixin
    extends MeshAppendable<Sprite>
    implements ITexturedBasic
{
    public get material() {
        return this.object3d.material
    }
    public set material(val) {
        this.object3d.material = val
    }

    private _materialParams?: Params
    public get materialParams() {
        return (this._materialParams ??= Object.values(defaultParams) as Params)
    }

    public materialParamString?: string

    public get color() {
        return this.materialParams[0]
    }
    public set color(val: string | undefined) {
        this.materialParams[0] = val
            ? "#" + color.set(val).getHexString()
            : defaults.color
        refreshParamsSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val: number | undefined) {
        this.materialParams[1] = val ?? defaults.opacity
        refreshParamsSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val: string | undefined) {
        this.materialParams[2] = val ?? defaults.texture
        refreshParamsSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val: string | undefined) {
        this.materialParams[3] = val ?? defaults.alphaMap
        refreshParamsSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4]
    }
    public set textureRepeat(val: number | Point | undefined) {
        this.materialParams[4] = val ?? defaults.textureRepeat
        refreshParamsSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5]
    }
    public set textureFlipY(val: boolean | undefined) {
        this.materialParams[5] = val ?? defaults.textureFlipY
        refreshParamsSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6]
    }
    public set textureRotation(val: number | undefined) {
        this.materialParams[6] = val ?? defaults.textureRotation
        refreshParamsSystem(this)
    }
}
