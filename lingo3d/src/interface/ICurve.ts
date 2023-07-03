import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"
import { disableSchema } from "../collections/disableSchema"
import { Point3dType } from "../utils/isPoint"

export default interface ICurve extends IMeshAppendable {
    points: Array<Point3dType>
    helper: boolean
    subdivide: number
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...meshAppendableSchema,
    points: Array,
    helper: Boolean,
    subdivide: Number
}
disableSchema.add("points")

export const curveDefaults = extendDefaults<ICurve>(
    [meshAppendableDefaults],
    {
        points: [],
        helper: false,
        subdivide: 3
    },
    {
        subdivide: new Range(1, 10, 1)
    }
)
