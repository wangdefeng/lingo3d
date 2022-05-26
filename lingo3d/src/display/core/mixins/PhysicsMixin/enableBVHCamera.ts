import { getEditorActive } from "../../../../states/useEditorActive"
import ThirdPersonCamera from "../../../cameras/ThirdPersonCamera"
import { vector3, vector3_, quaternion } from "../../../utils/reusables"
import { bvhCameraSet, onBeforeCameraLoop } from "./bvh/bvhCameraLoop"

function setVisible(this: ThirdPersonCamera, visible: boolean) {
    const target = this.targetState.get()

    //@ts-ignore
    if (target && target._visible === undefined)
        target.outerObject3d.visible = visible

    for (const child of this.camera.children)
        if (child.userData.manager?._visible === undefined)
            child.visible = visible
}

export default function(this: ThirdPersonCamera) {
    if (this.done) return

    const cam = this.camera
    bvhCameraSet.add(cam)
    this.then(() => bvhCameraSet.delete(cam))

    let tooCloseOld = false

    this.watch(onBeforeCameraLoop(() => {
        const origin = this.outerObject3d.getWorldPosition(vector3)
        const camPos = this.object3d.getWorldPosition(vector3_)
        const dist = camPos.distanceTo(origin)

        cam.position.lerp(camPos, 0.1)
        const ratio = cam.position.distanceTo(origin) / dist
        cam.position.lerpVectors(origin, camPos, ratio)

        cam.quaternion.copy(this.object3d.getWorldQuaternion(quaternion))

        const tooClose = getEditorActive() ? false : ratio < 0.35
        tooClose !== tooCloseOld && setVisible.call(this, !tooClose)
        tooCloseOld = tooClose
    }))
}