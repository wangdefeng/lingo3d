import ILoaded, { loadedDefaults, loadedSchema } from "./ILoaded"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"

export default interface ISvgMesh extends ILoaded, ITexturedStandard {
    innerHTML: Nullable<string>
}

export const svgMeshSchema: Required<ExtractProps<ISvgMesh>> = {
    ...loadedSchema,
    ...texturedStandardSchema,
    innerHTML: String
}

export const svgMeshDefaults = extendDefaults<ISvgMesh>(
    [loadedDefaults, texturedStandardDefaults],
    { innerHTML: undefined }
)
