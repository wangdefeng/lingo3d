import { curveHelperSpherePointMap } from "../../collections/curveHelperSpherePointMap"
import Curve from "../../display/Curve"
import HelperSphere from "../../display/core/utils/HelperSphere"
import { onTransformEdit } from "../../events/onTransformEdit"
import { addConfigCurveSystemPtr } from "../../pointers/addConfigCurveSystemPtr"
import eventSystem from "../utils/eventSystem"

export const [addCurveHelperSphereTransformEditSystem] = eventSystem(
    (self: HelperSphere, { target, phase, mode }) => {
        if (self !== target || mode !== "translate" || phase !== "end") return
        const pt = curveHelperSpherePointMap.get(self)!
        pt.x = self.x
        pt.y = self.y
        pt.z = self.z
        addConfigCurveSystemPtr[0](self.parent as Curve)
    },
    onTransformEdit
)
