import MeshAppendable from "../display/core/MeshAppendable"
import { Point3dType } from "../utils/isPoint"
import { lingoMouseEvent, LingoMouseEvent } from "./IMouse"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"
import { nullableDefault } from "./utils/NullableDefault"

export class HitEvent {
    public constructor(
        public target: MeshAppendable,
        public point?: Point3dType,
        public normal?: Point3dType
    ) {}
}
export const hitEvent = new HitEvent(undefined as any)

export default interface IVisible {
    bloom: Nullable<boolean>
    outline: Nullable<boolean>

    visible: Nullable<boolean>
    reflectionVisible: Nullable<boolean>
    castShadow: Nullable<boolean>

    onClick: Nullable<(e: LingoMouseEvent) => void>
    onMouseDown: Nullable<(e: LingoMouseEvent) => void>
    onMouseUp: Nullable<(e: LingoMouseEvent) => void>
    onMouseOver: Nullable<(e: LingoMouseEvent) => void>
    onMouseOut: Nullable<(e: LingoMouseEvent) => void>
    onMouseMove: Nullable<(e: LingoMouseEvent) => void>
    onHit: Nullable<(e: HitEvent) => void>
    onHitStart: Nullable<(e: HitEvent) => void>
    onHitEnd: Nullable<(e: HitEvent) => void>

    hitTarget: Nullable<string | Array<string>>
}

export const visibleSchema: Required<ExtractProps<IVisible>> = {
    bloom: Boolean,
    outline: Boolean,

    visible: Boolean,
    reflectionVisible: Boolean,
    castShadow: Boolean,

    hitTarget: [String, Array],

    onClick: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseOver: Function,
    onMouseOut: Function,
    onMouseMove: Function,
    onHit: Function,
    onHitStart: Function,
    onHitEnd: Function
}

export const visibleDefaults = extendDefaults<IVisible>([], {
    bloom: nullableDefault(false),
    outline: nullableDefault(false),

    visible: nullableDefault(true),
    reflectionVisible: nullableDefault(false),
    castShadow: nullableDefault(true),

    hitTarget: undefined,

    onClick: nullableCallback(lingoMouseEvent),
    onMouseDown: nullableCallback(lingoMouseEvent),
    onMouseUp: nullableCallback(lingoMouseEvent),
    onMouseOver: nullableCallback(lingoMouseEvent),
    onMouseOut: nullableCallback(lingoMouseEvent),
    onMouseMove: nullableCallback(lingoMouseEvent),
    onHit: nullableCallback(hitEvent),
    onHitStart: nullableCallback(hitEvent),
    onHitEnd: nullableCallback(hitEvent)
})
