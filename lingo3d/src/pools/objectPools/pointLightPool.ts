import PointLight from "../../display/lights/PointLight"
import PooledPointLight from "../../display/lights/PooledPointLight"
import scene from "../../engine/scene"
import createObjectPool from "../utils/createObjectPool"

export const pointLightPool = createObjectPool<
    PointLight,
    [],
    PooledPointLight
>(
    () => {
        const light = new PointLight()
        light.intensity = 0
        light.$ghost()
        return light
    },
    (light) => {
        light.dispose()
    },
    (light, self) => {
        light.distance = self.distance
        light.intensity = self.intensity
        light.color = self.color
        light.shadows = self.shadows
        light.fade = self.fade
        self.object3d.add(light.outerObject3d)
    },
    (light) => {
        light.fade = false
        light.intensity = 0
        scene.add(light.outerObject3d)
    }
)
