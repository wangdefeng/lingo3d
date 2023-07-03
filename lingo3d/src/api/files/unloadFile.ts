import { appendableRoot } from "../../collections/appendableRoot"
import Setup from "../../display/Setup"
import DefaultSkyLight from "../../display/lights/DefaultSkyLight"
import { resetMainCameraManager } from "../../engine/mainCameraManager"
import { setFileCurrent } from "../../states/useFileCurrent"

export const unloadFile = () => {
    for (const child of appendableRoot) !child.$disableUnload && child.dispose()
    resetMainCameraManager()
    new DefaultSkyLight()
    new Setup()
    setFileCurrent(undefined)
}
