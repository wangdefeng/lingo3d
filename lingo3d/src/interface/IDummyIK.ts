import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import { ExtractProps } from "./utils/extractProps"

export default interface IDummyIK extends IAppendable {
    target: Nullable<string>

    hips: Nullable<string>
    spine0: Nullable<string>
    spine1: Nullable<string>
    spine2: Nullable<string>
    neck: Nullable<string>

    leftShoulder: Nullable<string>
    leftArm: Nullable<string>
    leftForeArm: Nullable<string>
    leftHand: Nullable<string>

    rightShoulder: Nullable<string>
    rightArm: Nullable<string>
    rightForeArm: Nullable<string>
    rightHand: Nullable<string>

    leftThigh: Nullable<string>
    leftLeg: Nullable<string>
    leftFoot: Nullable<string>
    leftToeBase: Nullable<string>

    rightThigh: Nullable<string>
    rightLeg: Nullable<string>
    rightFoot: Nullable<string>
    rightToeBase: Nullable<string>
}

export const dummyIKSchema: Required<ExtractProps<IDummyIK>> = {
    ...appendableSchema,

    target: String,

    hips: String,
    spine0: String,
    spine1: String,
    spine2: String,
    neck: String,

    leftShoulder: String,
    leftArm: String,
    leftForeArm: String,
    leftHand: String,

    rightShoulder: String,
    rightArm: String,
    rightForeArm: String,
    rightHand: String,

    leftThigh: String,
    leftLeg: String,
    leftFoot: String,
    leftToeBase: String,

    rightThigh: String,
    rightLeg: String,
    rightFoot: String,
    rightToeBase: String
}

export const dummyIKDefaults = extendDefaults<IDummyIK>([appendableDefaults], {
    target: undefined,

    hips: undefined,
    spine0: undefined,
    spine1: undefined,
    spine2: undefined,
    neck: undefined,

    leftShoulder: undefined,
    leftArm: undefined,
    leftForeArm: undefined,
    leftHand: undefined,

    rightShoulder: undefined,
    rightArm: undefined,
    rightForeArm: undefined,
    rightHand: undefined,

    leftThigh: undefined,
    leftLeg: undefined,
    leftFoot: undefined,
    leftToeBase: undefined,

    rightThigh: undefined,
    rightLeg: undefined,
    rightFoot: undefined,
    rightToeBase: undefined
})
