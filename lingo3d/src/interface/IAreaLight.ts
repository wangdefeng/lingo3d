import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface IAreaLight extends ILightBase {
    helper: boolean
}

export const areaLightSchema: Required<ExtractProps<IAreaLight>> = {
    ...lightBaseSchema,
    helper: Boolean
}

export const areaLightDefaults: IAreaLight = {
    ...lightBaseDefaults,
    depth: 0,
    scaleZ: 0,
    helper: true
}