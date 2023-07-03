import { Object3D, Vector3 } from "three"
import IPhysicsObjectManager, {
    PhysicsOptions
} from "../../interface/IPhysicsObjectManager"
import {
    assignPxTransform,
    setPxVec,
    setPxVec_
} from "../../engine/physx/pxMath"
import Nullable from "../../interface/utils/Nullable"
import MeshAppendable from "./MeshAppendable"
import cookConvexGeometry, {
    decreaseConvexGeometryCount
} from "../../engine/physx/cookConvexGeometry"
import { physxPtr } from "../../pointers/physxPtr"
import VisibleObjectManager from "./VisibleObjectManager"
import {
    controllerVXUpdateMap,
    controllerVYUpdateMap,
    controllerVZUpdateMap,
    actorPtrManagerMap,
    controllerManagerContactMap,
    managerActorPtrMap,
    managerContactMap,
    managerGeometryMap
} from "../../collections/pxCollections"
import JointBase from "./JointBase"
import { configJointSystemPtr } from "../../pointers/configJointSystemPtr"
import { configPhysicsTransformSystem } from "../../systems/configSystems/configPhysicsTransformSystem"
import { Point3dType } from "../../utils/isPoint"
import SpawnPoint from "../SpawnPoint"
import { configPhysicsShapeSystem } from "../../systems/configLoadedSystems/configPhysicsShapeSystem"
import { physxLoopPtr } from "../../pointers/physxLoopPtr"
import { vector3__ } from "../utils/reusables"
import { busyCookingPtr } from "../../pointers/busyCookingPtr"

export default class PhysicsObjectManager<T extends Object3D = Object3D>
    extends VisibleObjectManager<T>
    implements IPhysicsObjectManager
{
    public $actor?: any
    public $capsuleHeight?: number
    public $controller?: any
    public $controllerMove?: Vector3
    public $convexGeometry?: any

    public override get x() {
        return super.x
    }
    public override set x(val) {
        super.x = val
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override get rotationX() {
        return super.rotationX
    }
    public override set rotationX(val) {
        super.rotationX = val
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override get rotationY() {
        return super.rotationY
    }
    public override set rotationY(val) {
        super.rotationY = val
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override get rotationZ() {
        return super.rotationZ
    }
    public override set rotationZ(val) {
        super.rotationZ = val
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override get scaleX() {
        return super.scaleX
    }
    public override set scaleX(val) {
        super.scaleX = val
        this.$actor && configPhysicsShapeSystem.add(this)
    }

    public override get scaleY() {
        return super.scaleY
    }
    public override set scaleY(val) {
        super.scaleY = val
        this.$actor && configPhysicsShapeSystem.add(this)
    }

    public override get scaleZ() {
        return super.scaleZ
    }
    public override set scaleZ(val) {
        super.scaleZ = val
        this.$actor && configPhysicsShapeSystem.add(this)
    }

    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        this.$actor && configPhysicsShapeSystem.add(this)
    }

    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        this.$actor && configPhysicsShapeSystem.add(this)
    }

    public override get depth() {
        return super.depth
    }
    public override set depth(val) {
        super.depth = val
        this.$actor && configPhysicsShapeSystem.add(this)
    }

    public override translateX(val: number) {
        super.translateX(val)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override translateY(val: number) {
        super.translateY(val)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override translateZ(val: number) {
        super.translateZ(val)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override rotateX(val: number) {
        super.rotateX(val)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override rotateY(val: number) {
        super.rotateY(val)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override rotateZ(val: number) {
        super.rotateZ(val)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override setRotationFromDirection(direction: Point3dType) {
        super.setRotationFromDirection(direction)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override placeAt(
        target: MeshAppendable | Point3dType | SpawnPoint | string
    ) {
        super.placeAt(target)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override moveForward(distance: number) {
        if (this.$controller && physxLoopPtr[0]) {
            vector3__.copy(this.position)
            super.moveForward(distance)
            ;(this.$controllerMove ??= new Vector3())
                .add(this.position)
                .sub(vector3__)
            this.position.copy(vector3__)
            return
        }
        super.moveForward(distance)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override moveRight(distance: number) {
        if (this.$controller && physxLoopPtr[0]) {
            vector3__.copy(this.position)
            super.moveRight(distance)
            ;(this.$controllerMove ??= new Vector3())
                .add(this.position)
                .sub(vector3__)
            this.position.copy(vector3__)
            return
        }
        super.moveRight(distance)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    public override lookAt(target: MeshAppendable | Point3dType): void
    public override lookAt(x: number, y: number | undefined, z: number): void
    public override lookAt(
        a0: MeshAppendable | Point3dType | number,
        a1?: number,
        a2?: number
    ) {
        //@ts-ignore
        super.lookAt(a0, a1, a2)
        this.$actor && configPhysicsTransformSystem.add(this)
    }

    private _mass?: number
    public get mass(): number {
        if (this.$controller) return 1
        if (this.$actor && !this.$actor.getMass) return 0
        return this.$actor?.getMass() ?? this._mass ?? 1
    }
    public set mass(val) {
        this._mass = val
        this.$actor?.setMass?.(val)
    }

    public gravity: Nullable<boolean>

    public get velocityX(): number {
        return this.$actor?.getLinearVelocity().get_x() ?? 0
    }
    public set velocityX(val) {
        const { $actor: actor } = this
        if (!actor) return

        if (this._physics === "character") {
            controllerVXUpdateMap.set(this, val)
            return
        }
        const velocity = actor.getLinearVelocity()
        velocity.set_x(val)
        actor.setLinearVelocity(velocity)
    }

    public get velocityY(): number {
        return this.$actor?.getLinearVelocity().get_y() ?? 0
    }
    public set velocityY(val) {
        const { $actor: actor } = this
        if (!actor) return

        if (this._physics === "character") {
            controllerVYUpdateMap.set(this, val)
            return
        }
        const velocity = actor.getLinearVelocity()
        velocity.set_y(val)
        actor.setLinearVelocity(velocity)
    }

    public get velocityZ(): number {
        return this.$actor?.getLinearVelocity().get_z() ?? 0
    }
    public set velocityZ(val) {
        const { $actor: actor } = this
        if (!actor) return

        if (this._physics === "character") {
            controllerVZUpdateMap.set(this, val)
            return
        }
        const velocity = actor.getLinearVelocity()
        velocity.set_z(val)
        actor.setLinearVelocity(velocity)
    }

    public addForce(x: number, y: number, z: number) {
        this.$actor?.addForce(setPxVec(x, y, z))
    }

    public addLocalForceAtPos(
        x: number,
        y: number,
        z: number,
        posX = 0,
        posY = 0,
        posZ = 0
    ) {
        const { PxRigidBodyExt } = physxPtr[0]
        if (!PxRigidBodyExt || !this.$actor) return

        PxRigidBodyExt.prototype.addLocalForceAtPos(
            this.$actor,
            setPxVec(x, y, z),
            setPxVec_(posX, posY, posZ)
        )
    }

    public addLocalForceAtLocalPos(
        x: number,
        y: number,
        z: number,
        posX = 0,
        posY = 0,
        posZ = 0
    ) {
        const { PxRigidBodyExt } = physxPtr[0]
        if (!PxRigidBodyExt || !this.$actor) return

        PxRigidBodyExt.prototype.addLocalForceAtLocalPos(
            this.$actor,
            setPxVec(x, y, z),
            setPxVec_(posX, posY, posZ)
        )
    }

    public addTorque(x: number, y: number, z: number) {
        this.$actor?.addTorque(setPxVec(x, y, z))
    }

    private _joints?: Set<JointBase>
    public get $joints() {
        return (this._joints ??= new Set())
    }

    public $initActor(actor: any) {
        this.$actor = actor
        const { _mass } = this
        if (_mass !== undefined) actor.mass = _mass
        actorPtrManagerMap.set(actor.ptr, this)
        managerActorPtrMap.set(this, actor.ptr)
        if (this._joints)
            for (const joint of this._joints) configJointSystemPtr[0].add(joint)
        return actor
    }

    protected override disposeNode() {
        super.disposeNode()
        decreaseConvexGeometryCount(this)
    }
    public $getPxShape(_: PhysicsOptions, actor: any) {
        const { material, shapeFlags, PxRigidActorExt, pxFilterData } =
            physxPtr[0]

        const geometry = cookConvexGeometry(this.componentName, this)
        managerGeometryMap.set(this, geometry)

        const shape = PxRigidActorExt.prototype.createExclusiveShape(
            actor,
            geometry,
            material,
            shapeFlags
        )
        shape.setSimulationFilterData(pxFilterData)
        return shape
    }

    private _physics?: PhysicsOptions
    public get physics() {
        return this._physics
    }
    public set physics(val) {
        this._physics = val
        val === "map" && busyCookingPtr[0]++
        configPhysicsShapeSystem.add(this)
    }

    private _jointCount?: number
    public get $jointCount() {
        return this._jointCount ?? 0
    }
    public set $jointCount(val) {
        this._jointCount = val
        configPhysicsShapeSystem.add(this)
    }

    //@ts-ignore
    public override hitTest(target: MeshAppendable | PhysicsObjectManager) {
        if (this._physics && "_physics" in target && target._physics) {
            if (this._physics === "character")
                return !!controllerManagerContactMap.get(this)?.has(target)
            if (target._physics === "character")
                return !!controllerManagerContactMap.get(target)?.has(this)
            return !!managerContactMap.get(this)?.has(target)
        }
        return super.hitTest(target)
    }

    public queryPhysicsOverlap() {
        const { pxOverlap } = physxPtr[0]
        const geometry = managerGeometryMap.get(this)
        if (!pxOverlap || !geometry) return []

        const result: Array<PhysicsObjectManager> = []
        for (const item of pxOverlap(geometry, assignPxTransform(this)))
            result.push(actorPtrManagerMap.get(item.actor.ptr)!)
        return result
    }
}
