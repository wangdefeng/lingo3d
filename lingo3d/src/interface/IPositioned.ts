import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../events/onTransformControls"
import fn from "./utils/fn"

export default interface IPositioned {
    x: number
    y: number
    z: number

    onMove: Nullable<() => void>
    onTransformControls: Nullable<
        (phase: TransformControlsPhase, mode: TransformControlsMode) => void
    >
    onMoveToEnd: Nullable<() => void>

    moveTo: Function | Array<any>
    lerpTo: Function | Array<any>
    placeAt: Function | Array<any>

    translateX: Function | Array<any>
    translateY: Function | Array<any>
    translateZ: Function | Array<any>
}

export const positionedSchema: Required<ExtractProps<IPositioned>> = {
    x: Number,
    y: Number,
    z: Number,

    onMove: Function,
    onTransformControls: Function,
    onMoveToEnd: Function,

    moveTo: [Function, Array],
    lerpTo: [Function, Array],
    placeAt: [Function, Array],

    translateX: [Function, Array],
    translateY: [Function, Array],
    translateZ: [Function, Array]
}

export const positionedDefaults = extendDefaults<IPositioned>([], {
    x: 0,
    y: 0,
    z: 0,

    onMove: undefined,
    onTransformControls: undefined,
    onMoveToEnd: undefined,

    moveTo: fn,
    lerpTo: fn,
    placeAt: fn,

    translateX: fn,
    translateY: fn,
    translateZ: fn
})
