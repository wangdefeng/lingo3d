import { forceGetInstance } from "@lincode/utils"
import { PointType } from "../../utils/isPoint"

export default <
    Type extends object,
    Params extends Array<string | number | boolean | PointType | undefined>,
    Context extends object | void = void
>(
    factory: (params: Params, context: Context) => Type,
    dispose?: (object: Type) => void,
    onRequest?: (object: Type, context: Context) => void,
    onRelease?: (object: Type) => void
) => {
    const paramStringObjectArrayMap = new Map<string, Array<Type>>()
    const objectParamStringMap = new WeakMap<Type, string>()
    const releasedObjects = new WeakSet<Type>()
    let allObjects: Array<Type> = []

    const request = (
        params: Params,
        paramString = JSON.stringify(params),
        context = undefined as Context
    ): Type => {
        ++pool.count
        const objectArray = forceGetInstance(
            paramStringObjectArrayMap,
            paramString,
            Array<Type>
        )
        if (objectArray.length) {
            const object = objectArray.pop()!
            releasedObjects.delete(object)
            onRequest?.(object, context)
            return object
        }
        const result = factory(params, context)
        objectParamStringMap.set(result, paramString)
        allObjects.push(result)
        onRequest?.(result, context)
        return result
    }

    const release = (object: Type | undefined | null) => {
        if (!object || releasedObjects.has(object)) return
        releasedObjects.add(object)

        paramStringObjectArrayMap
            .get(objectParamStringMap.get(object)!)!
            .push(object)

        --pool.count
        onRelease?.(object)
    }

    const clear = () => {
        if (dispose) for (const object of allObjects) dispose(object)
        paramStringObjectArrayMap.clear()
        allObjects = []
        pool.count = 0
    }

    const pool = { request, release, clear, count: 0 }
    return pool
}
