import CameraBase from "../../display/core/CameraBase"
import { gyrateInertiaSystem } from "../gyrateInertiaSystem"
import createInternalSystem from "../utils/createInternalSystem"

export const gyrateResetSystem = createInternalSystem("gyrateResetSystem", {
    effect: (self: CameraBase) => {
        self.gyrate(0, 0)
        gyrateInertiaSystem.delete(self)
    }
})
