import { objectURLFileMap } from "../../display/core/utils/objectURL"
import { equalsDefaultValue } from "../../interface/utils/getDefaultValue"
import { getFileCurrent } from "../../states/useFileCurrent"
import Appendable from "../core/Appendable"
import relativePath from "../path/relativePath"
import toFixed, { toFixedPoint } from "./toFixed"
import { SceneGraphNode } from "./types"
import { VERSION } from "../../globals"
import { nonSerializedAppendables, appendableRoot } from "../core/collections"
import { isPoint } from "./isPoint"
import nonSerializedProperties from "./nonSerializedProperties"

const serialize = (children: Array<any> | Set<any>, skipUUID?: boolean) => {
    const dataParent: Array<SceneGraphNode> = []
    for (const child of children) {
        if (nonSerializedAppendables.has(child)) continue

        const { componentName, schema, defaults } = child.constructor

        const data: Record<string, any> = { type: componentName }
        for (const [key, type] of Object.entries(schema)) {
            if (
                type === Function ||
                (Array.isArray(type) && type.includes(Function)) ||
                nonSerializedProperties.includes(key) ||
                (skipUUID && key === "uuid")
            )
                continue

            let value: any
            if (key === "animations") {
                value = child.serializeAnimations
                if (!value) continue
            } else if (key === "animation") {
                value = child.serializeAnimation
                if (!value) continue
            } else value = child[key]

            const t = typeof value
            if (equalsDefaultValue(value, defaults, key) || t === "function")
                continue

            const fileCurrent = getFileCurrent()
            if (
                t === "string" &&
                value.startsWith("blob:http") &&
                fileCurrent
            ) {
                const file = objectURLFileMap.get(value)!
                value = relativePath(
                    fileCurrent.webkitRelativePath,
                    file.webkitRelativePath
                )
            } else if (t === "number") value = toFixed(value)
            else if (isPoint(value, t)) value = toFixedPoint(value)
            else if (Array.isArray(value) && value.some((v) => isPoint(v)))
                value = value.map((v) => (isPoint(v) ? toFixedPoint(v) : v))

            data[key] = value
        }
        if (child.children) {
            const dataChildren = serialize(child.children, skipUUID)
            if (dataChildren.length) data.children = dataChildren
        }
        dataParent.push(data as SceneGraphNode)
    }
    return dataParent
}

export default (
    versionStamp?: boolean,
    children: Array<Appendable> | Set<Appendable> | Appendable = appendableRoot,
    skipUUID?: boolean
) => {
    if (children instanceof Appendable) return serialize([children], skipUUID)
    const result = serialize(children, skipUUID)
    versionStamp && result.unshift({ type: "lingo3d", version: VERSION })
    return result
}
