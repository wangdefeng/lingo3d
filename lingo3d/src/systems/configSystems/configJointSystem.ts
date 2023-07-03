import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { importPhysX } from "../configLoadedSystems/configPhysicsShapeSystem"
import { uuidMap } from "../../collections/idCollections"
import { jointTargetTransformEditSystem } from "../eventSystems/jointTargetTransformEditSystem"
import { configJointSystemPtr } from "../../pointers/configJointSystemPtr"
import createInternalSystem from "../utils/createInternalSystem"
import { configJointCreateSystem } from "./configJointCreateSystem"

export const configJointSystem = createInternalSystem("configJointSystem", {
    effect: (self: JointBase) => {
        const { to, from } = self
        if (!to || !from) return false

        const toManager = uuidMap.get(to)
        const fromManager = uuidMap.get(from)
        if (
            !(toManager instanceof PhysicsObjectManager) ||
            !(fromManager instanceof PhysicsObjectManager)
        )
            return false

        fromManager.$jointCount++
        toManager.$jointCount++
        self.$fromManager = fromManager
        self.$toManager = toManager
        fromManager.$joints.add(self)
        toManager.$joints.add(self)

        jointTargetTransformEditSystem.add(self, { fromManager, toManager })
        configJointCreateSystem.add(self)
    },
    cleanup: (self) => {
        jointTargetTransformEditSystem.delete(self)
        configJointCreateSystem.delete(self)

        self.$fromManager!.$jointCount--
        self.$toManager!.$jointCount--
        self.$fromManager!.$joints.delete(self)
        self.$toManager!.$joints.delete(self)
        self.$fromManager = undefined
        self.$toManager = undefined
    },
    effectTicker: [importPhysX]
})

configJointSystemPtr[0] = configJointSystem
