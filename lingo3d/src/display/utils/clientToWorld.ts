import { CM2M } from "../../globals"
import { getCameraRendered } from "../../states/useCameraRendered"
import getWorldPosition from "./getWorldPosition"
import normalizeClientPosition from "./normalizeClientPosition"
import { vector3 } from "./reusables"
import { vec2Point } from "./vec2Point"

export default (clientX: number, clientY: number, distance = 500) => {
    const [xNorm, yNorm] = normalizeClientPosition(clientX, clientY)

    const camera = getCameraRendered()
    const cameraPosition = getWorldPosition(camera)

    vector3.set(xNorm, yNorm, 0.5)
    vector3.unproject(camera)
    vector3.sub(cameraPosition).normalize()

    return vec2Point(
        cameraPosition.add(vector3.multiplyScalar(distance * CM2M))
    )
}
