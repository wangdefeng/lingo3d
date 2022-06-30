
import { ThirdPersonCamera, Dummy, Reflector, keyboard, settings, mouse, Line, Sphere } from ".."
import createProxy from "../api/createProxy"

export default {}

settings.gridHelper = true

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = "roughness.png"
reflector.normalMap = "normal.jpg"
reflector.roughness = 5

const dummy = new Dummy()
dummy.y = 170 * 0.5
dummy.preset = "rifle"
dummy.physics = "character"
dummy.strideMove = true
// dummy.strideMode = "free"

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.activate()
cam.transition = true
cam.mouseControl = true
// cam.lockTargetRotation = "dynamic-lock"
cam.innerX = 50
cam.innerY = 50

const dummyProxy = createProxy<Dummy>()
dummy.proxy = dummyProxy

// const map = new Model()
// map.scale = 200
// map.src = cbpunkSrc
// map.y = 8900
// map.z = 1000
// map.physics = "map"

keyboard.onKeyPress = (_, pressed) => {
    if (pressed.has("w"))
        dummyProxy.strideForward = -5
    else if (pressed.has("s"))
        dummyProxy.strideForward = 5
    else
        dummyProxy.strideForward = 0

    if (pressed.has("a"))
        dummyProxy.strideRight = 5
    else if (pressed.has("d"))
        dummyProxy.strideRight = -5
    else
        dummyProxy.strideRight = 0

    if (pressed.has("Space"))
        dummyProxy.jump(10)
}

mouse.onClick = () => {
    const line = new Line()
    line.from = { x: dummy.x, y: dummy.y, z: dummy.z }
    const pt = cam.pointAt(10000)
    line.to = { x: pt.x, y: pt.y, z: pt.z }
    line.bloom = true
}