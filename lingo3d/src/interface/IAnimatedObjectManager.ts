import AnimationManager from "../display/core/AnimatedObjectManager/AnimationManager"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import Defaults from "./utils/Defaults"
import IStaticObjectManager, {
    staticObjectManagerDefaults,
    staticObjectManagerSchema
} from "./IStaticObjectManaget"

export type AnimationValue = Record<string, Array<number>>
export type Animation =
    | string
    | number
    | Array<string | number>
    | boolean
    | AnimationValue

export default interface IAnimatedObjectManager extends IStaticObjectManager {
    animations: Record<string, string | AnimationManager>
    animation: Nullable<Animation>
    animationPaused: Nullable<boolean>
    animationRepeat: Nullable<boolean>
    onAnimationFinish: Nullable<() => void>
}

export const animatedObjectManagerSchema: Required<
    ExtractProps<IAnimatedObjectManager>
> = {
    ...staticObjectManagerSchema,

    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean,
    animationRepeat: Boolean,
    onAnimationFinish: Function
}

export const animatedObjectManagerDefaults: Defaults<IAnimatedObjectManager> = {
    ...staticObjectManagerDefaults,

    animations: {},
    animation: undefined,
    animationPaused: [undefined, false],
    animationRepeat: [undefined, true],
    onAnimationFinish: undefined
}
