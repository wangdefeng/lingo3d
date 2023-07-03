import PooledPrimitve from "../../display/core/PooledPrimitive"
import createInternalSystem from "../utils/createInternalSystem"

export const refreshPooledPrimitiveSystem = createInternalSystem(
    "refreshPooledPrimitiveSystem",
    {
        effect: (self: PooledPrimitve) => {
            self.object3d.geometry = self.$geometryPool.request(
                self.$getParams() as any
            )
        },
        cleanup: (self) =>
            self.$geometryPool.release(self.object3d.geometry as any)
    }
)
