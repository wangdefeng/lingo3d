import { Object3D, BufferGeometry, Mesh } from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import Loaded from "../../Loaded"
import { physxPtr } from "./physxPtr"

export default (manager: MeshAppendable | Loaded) => {
    const { Vector_PxVec3 } = physxPtr[0]

    const geometries: Array<BufferGeometry> = []

    const loaded =
        "loadedObject3d" in manager ? manager.loadedObject3d! : manager.object3d
    loaded.updateMatrixWorld()

    const { position, rotation } = manager.outerObject3d
    loaded.traverse((c: Object3D | Mesh) => {
        if (!("geometry" in c)) return
        const clone = c.geometry.clone()
        clone.applyMatrix4(c.matrixWorld)
        clone.translate(-position.x, -position.y, -position.z)
        clone.rotateX(-rotation.x)
        clone.rotateY(-rotation.y)
        clone.rotateZ(-rotation.z)
        clone.deleteAttribute("uv2")
        clone.dispose()
        geometries.push(clone)
    })
    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    geometry.dispose()

    const buffer = geometry.attributes.position
    const vertices = buffer.array

    const vec3Vector = new Vector_PxVec3(buffer.count)
    for (let i = 0; i < buffer.count; i++) {
        const pxVec3 = vec3Vector.at(i)
        const offset = i * 3
        pxVec3.set_x(vertices[offset])
        pxVec3.set_y(vertices[offset + 1])
        pxVec3.set_z(vertices[offset + 2])
    }
    return [vec3Vector, buffer.count, geometry.index]
}
