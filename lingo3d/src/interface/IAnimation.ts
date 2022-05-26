import AnimationManager from "../display/core/mixins/AnimationMixin/AnimationManager"
import { ExtractProps } from "./utils/extractProps"

export type AnimationValue = Record<string, Array<number>>
export type Animation = string | number | Array<string | number> | boolean | AnimationValue

export default interface IAnimation {
    animations: Record<string, string | AnimationManager>
    animation?: Animation
    animationPaused: boolean
}

export const animationSchema: Required<ExtractProps<IAnimation>> = {
    animations: Object,
    animation: [String, Number, Array, Boolean, Object],
    animationPaused: Boolean
}

export const animationDefaults: IAnimation = {
    animations: {},
    animationPaused: false
}