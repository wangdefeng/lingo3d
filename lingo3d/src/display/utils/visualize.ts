import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { Sphere } from "../.."
import IPrimitive from "../../interface/IPrimitive"
import { unselectableSet } from "../core/utils/raycast/selectionCandidates"

const sphereMap = new Map<string, Sphere>()

export default (
    name: string,
    pt: Point3d,
    properties?: Partial<IPrimitive>
) => {
    const sphere = forceGet(sphereMap, name, () => {
        const sphere = Object.assign(new Sphere(), properties)
        unselectableSet.add(sphere.object3d)
        return sphere
    })
    sphere.placeAt(pt)
    return sphere
}
