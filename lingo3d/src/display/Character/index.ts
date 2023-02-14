import { Object3D, Quaternion } from "three"
import { YBOT_URL } from "../../api/assetsPath"
import { onBeforeRender } from "../../events/onBeforeRender"
import IModel, { modelDefaults, modelSchema } from "../../interface/IModel"
import Bone from "../Bone"
import Model from "../Model"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import {
    complementQuaternion,
    diffQuaternions,
    worldToLocalQuaternion
} from "../utils/quaternions"

export default class Character extends Model implements IModel {
    public static override componentName = "character"
    public static override defaults = modelDefaults
    public static override schema = modelSchema

    public constructor() {
        super()
        this.width = 20
        this.depth = 20
        this.scale = 1.7

        this.src = YBOT_URL()

        this.loaded.then(() => {
            const arm = this.find("LeftArm")?.outerObject3d
            const foreArm = this.find("LeftForeArm")?.outerObject3d
            const hand = this.find("LeftHand")?.outerObject3d

            if (!arm || !foreArm || !hand) return

            const data: Array<[Bone, Object3D, Quaternion]> = []
            const boneMap = new WeakMap<Object3D, Bone>()
            const attachBone = (arm: Object3D, foreArm: Object3D) => {
                const bone = new Bone(arm, foreArm)
                boneMap.set(foreArm, bone)
                boneMap.get(arm)?.attach(bone)

                //todo: change clone to vector3.copy
                const from = arm.quaternion.clone()
                arm.quaternion.copy(
                    worldToLocalQuaternion(
                        arm,
                        getWorldQuaternion(bone.outerObject3d)
                    )
                )
                const diff = diffQuaternions(from, arm.quaternion)
                complementQuaternion(arm.quaternion, diff)

                data.push([bone, arm, diff])
            }
            attachBone(arm, foreArm)
            attachBone(foreArm, hand)

            const handle = onBeforeRender(() => {
                for (const [bone, arm, diff] of data) {
                    arm.quaternion.copy(
                        worldToLocalQuaternion(
                            arm,
                            getWorldQuaternion(bone.outerObject3d)
                        )
                    )
                    complementQuaternion(arm.quaternion, diff)
                }
            })
            return () => {
                handle.cancel()
            }
        })
    }
}
