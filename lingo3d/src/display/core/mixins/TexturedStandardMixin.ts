import { debounce } from "@lincode/utils"
import { Color, MeshStandardMaterial, ObjectSpaceNormalMap, TangentSpaceNormalMap, Vector2 } from "three"
import ITexturedStandard, { NormalMapType } from "../../../interface/ITexturedStandard"
import loadTexture from "../../utils/loaders/loadTexture"

const mapNames = <const>["map", "alphaMap", "envMap", "aoMap", "bumpMap", "displacementMap", "emissiveMap", "lightMap", "metalnessMap", "roughnessMap", "normalMap"]

const textureRepeatMap = new Map<TexturedStandardMixin, Vector2>()
const applyTextureRepeat = debounce(function(this: TexturedStandardMixin) {
    for (const [item, repeat] of textureRepeatMap) {
        for (const name of mapNames) {
            const map = item.material[name]
            map && (map.repeat = repeat)
        }
    }
    textureRepeatMap.clear()
}, 0, "trailing")

export default abstract class TexturedStandardMixin implements ITexturedStandard {
    protected abstract material: MeshStandardMaterial

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.material.color = new Color(val)
    }

    public get wireframe() {
        return this.material.wireframe
    }
    public set wireframe(val) {
        this.material.wireframe = val
    }

    private standardTextureRepeat() {
        this.material.needsUpdate = true
        //@ts-ignore
        if (!this._textureRepeat) return
        //@ts-ignore
        textureRepeatMap.set(this, this._textureRepeat)
        applyTextureRepeat()
    }

    private _envMap?: string
    public get envMap() {
        return this._envMap
    }
    public set envMap(val) {
        this._envMap = val
        this.material.envMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    private _aoMap?: string
    public get aoMap() {
        return this._aoMap
    }
    public set aoMap(val) {
        this._aoMap = val
        this.material.aoMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get aoMapIntensity() {
        return this.material.aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this.material.aoMapIntensity = val
    }

    private _bumpMap?: string
    public get bumpMap() {
        return this._bumpMap
    }
    public set bumpMap(val) {
        this._bumpMap = val
        this.material.bumpMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get bumpScale() {
        return this.material.bumpScale
    }
    public set bumpScale(val) {
        this.material.bumpScale = val
    }

    private _displacementMap?: string
    public get displacementMap() {
        return this._displacementMap
    }
    public set displacementMap(val) {
        this._displacementMap = val
        this.material.displacementMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get displacementScale() {
        return this.material.displacementScale
    }
    public set displacementScale(val) {
        this.material.displacementScale = val
    }

    public get displacementBias() {
        return this.material.displacementBias
    }
    public set displacementBias(val) {
        this.material.displacementBias = val
    }

    public get emissiveColor() {
        return "#" + this.material.emissive.getHexString()
    }
    public set emissiveColor(val) {
        this.material.emissive = new Color(val)
    }

    private _emissiveMap?: string
    public get emissiveMap() {
        return this._emissiveMap
    }
    public set emissiveMap(val) {
        this._emissiveMap = val
        this.material.emissiveMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get emissiveIntensity() {
        return this.material.emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this.material.emissiveIntensity = val
    }

    private _lightMap?: string
    public get lightMap() {
        return this._lightMap
    }
    public set lightMap(val) {
        this._lightMap = val
        this.material.lightMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get lightMapIntensity() {
        return this.material.lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this.material.lightMapIntensity = val
    }

    private _metalnessMap?: string
    public get metalnessMap() {
        return this._metalnessMap
    }
    public set metalnessMap(val) {
        this._metalnessMap = val
        this.material.metalnessMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get metalness() {
        return this.material.metalness
    }
    public set metalness(val) {
        this.material.metalness = val
    }

    private _roughnessMap?: string
    public get roughnessMap() {
        return this._roughnessMap
    }
    public set roughnessMap(val) {
        this._roughnessMap = val
        this.material.roughnessMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get roughness() {
        return this.material.roughness
    }
    public set roughness(val) {
        this.material.roughness = val
    }

    private _normalMap?: string
    public get normalMap() {
        return this._normalMap
    }
    public set normalMap(val) {
        this._normalMap = val
        this.material.normalMap = val ? loadTexture(val) : null
        this.standardTextureRepeat()
    }

    public get normalScale() {
        return this.material.normalScale
    }
    public set normalScale(val: Vector2 | number) {
        if (typeof val === "number")
            this.material.normalScale = new Vector2(val, val)
        else
            this.material.normalScale = val
    }

    private _normalMapType?: NormalMapType
    public get normalMapType() {
        return this._normalMapType
    }
    public set normalMapType(val) {
        this._normalMapType = val
        this.material.normalMapType = val === "objectSpace" ? ObjectSpaceNormalMap : TangentSpaceNormalMap
    }
}