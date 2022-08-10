import { CircleBufferGeometry } from "three"
import Primitive from "../core/Primitive"
import { flatGeomScaleZ, radiusScaled } from "../../engine/constants"
import circleShape from "../core/PhysicsObjectManager/cannon/shapes/circleShape"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"

const circleGeometry = new CircleBufferGeometry(radiusScaled, 32)

export default class Circle extends Primitive implements ICircle {
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    protected override _physicsShape = circleShape

    public constructor() {
        super(circleGeometry, true)
        this.object3d.scale.z = flatGeomScaleZ
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
