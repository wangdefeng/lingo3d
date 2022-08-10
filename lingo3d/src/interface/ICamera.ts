import ICameraBase, {
    cameraBaseDefaults,
    cameraBaseSchema
} from "./ICameraBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ICamera extends ICameraBase {}

export const cameraSchema: Required<ExtractProps<ICamera>> = {
    ...cameraBaseSchema
}

export const cameraDefaults: Defaults<ICamera> = {
    ...cameraBaseDefaults
}
