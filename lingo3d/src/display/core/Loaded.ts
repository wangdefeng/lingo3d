import { Group, Mesh, MeshStandardMaterial, Object3D } from "three"
import ILoaded from "../../interface/ILoaded"
import { PhysicsOptions } from "../../interface/IPhysicsObjectManager"
import cookTrimeshGeometry from "../../engine/physx/cookTrimeshGeometry"
import { StandardMesh } from "./mixins/TexturedStandardMixin"
import { physxPtr } from "../../pointers/physxPtr"
import PhysicsObjectManager from "./PhysicsObjectManager"
import { boxGeometry } from "../primitives/Cube"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { configLoadedSrcSystem } from "../../systems/configSystems/configLoadedSrcSystem"
import { managerGeometryMap } from "../../collections/pxCollections"

const material = new MeshStandardMaterial({ visible: false })

export default abstract class Loaded<T = Object3D>
    extends PhysicsObjectManager<StandardMesh>
    implements ILoaded
{
    public $loadedGroup = new Group()
    public $loadedObject3d?: Object3D

    public constructor() {
        super(new Mesh(boxGeometry, material))
        ssrExcludeSet.add(this.object3d)
        this.outerObject3d.add(this.$loadedGroup)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.object3d)
    }

    public abstract $load(src: string): Promise<T>

    public abstract $resolveLoaded(data: T, src: string): Group

    protected _src?: string
    public get src() {
        return this._src
    }
    public set src(val) {
        this._src = val
        val
            ? configLoadedSrcSystem.add(this)
            : configLoadedSrcSystem.delete(this)
    }

    private _onLoad?: () => void
    public get onLoad() {
        return this._onLoad
    }
    public set onLoad(cb) {
        this._onLoad = cb
        this.cancelHandle("onLoad", cb && (() => this.$events.on("loaded", cb)))
    }

    protected widthSet?: boolean
    public override get width() {
        return super.width
    }
    public override set width(val) {
        super.width = val
        this.widthSet = true
    }

    protected heightSet?: boolean
    public override get height() {
        return super.height
    }
    public override set height(val) {
        super.height = val
        this.heightSet = true
    }

    protected depthSet?: boolean
    public override get depth() {
        return super.depth
    }
    public override set depth(val) {
        super.depth = val
        this.depthSet = true
    }

    public override get innerRotationX() {
        return super.innerRotationX
    }
    public override set innerRotationX(val) {
        super.innerRotationX = val
        this.$loadedGroup.rotation.x = this.object3d.rotation.x
    }

    public override get innerRotationY() {
        return super.innerRotationY
    }
    public override set innerRotationY(val) {
        super.innerRotationY = val
        this.$loadedGroup.rotation.y = this.object3d.rotation.y
    }

    public override get innerRotationZ() {
        return super.innerRotationZ
    }
    public override set innerRotationZ(val) {
        super.innerRotationZ = val
        this.$loadedGroup.rotation.z = this.object3d.rotation.z
    }

    public override get innerX() {
        return super.innerX
    }
    public override set innerX(val) {
        super.innerX = val
        this.$loadedGroup.position.x = this.object3d.position.x
    }

    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val) {
        super.innerY = val
        this.$loadedGroup.position.y = this.object3d.position.y
    }

    public override get innerZ() {
        return super.innerZ
    }
    public override set innerZ(val) {
        super.innerZ = val
        this.$loadedGroup.position.z = this.object3d.position.z
    }

    public override get innerVisible() {
        return this.$loadedGroup.visible
    }
    public override set innerVisible(val) {
        this.$loadedGroup.visible = val
    }

    public get boxVisible() {
        return false
    }
    public set boxVisible(val) {
        //todo: implement appending box to object3d
    }

    public override $getPxShape(mode: PhysicsOptions, actor: any): any {
        if (mode === "map") {
            const { material, shapeFlags, PxRigidActorExt, pxFilterData } =
                physxPtr[0]

            const geometry = cookTrimeshGeometry(this._src!, this)
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
        return super.$getPxShape(mode, actor)
    }
}
