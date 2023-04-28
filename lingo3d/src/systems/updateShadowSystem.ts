import { castShadowChanged } from "../utilsCached/castShadowChanged"
import { positionChanged } from "../utilsCached/positionChanged"
import { quaternionChanged } from "../utilsCached/quaternionChanged"
import renderSystemWithData from "./utils/renderSystemWithData"
import { shadowModePtr } from "../pointers/shadowModePtr"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import updateShadow from "../display/utils/updateShadow"

export const [addUpdateShadowSystem, deleteUpdateShadowSystem] =
    renderSystemWithData(
        (self: PointLight | SpotLight, data: { count: number | undefined }) => {
            if (!self.object3d.visible || !self.castShadow || !shadowModePtr[0])
                return

            if (shadowModePtr[0] === "physics") {
                if (
                    positionChanged(self.object3d) ||
                    quaternionChanged(self.object3d)
                ) {
                    updateShadow(self.object3d.shadow)
                    return
                }
                const nearby = self.queryNearby(self.distance)
                if (data.count !== nearby.length) {
                    data.count = nearby.length
                    updateShadow(self.object3d.shadow)
                    return
                }
                for (const manager of nearby)
                    if (
                        positionChanged(manager.object3d) ||
                        quaternionChanged(manager.object3d) ||
                        castShadowChanged(manager.object3d)
                    ) {
                        updateShadow(self.object3d.shadow)
                        return
                    }
            } else updateShadow(self.object3d.shadow)
        }
    )
