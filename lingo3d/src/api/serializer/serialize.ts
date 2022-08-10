import Setup from "../../display/Setup"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import Appendable, {
    appendableRoot,
    hiddenAppendables
} from "../core/Appendable"
import settings from "../settings"
import { nonSerializedProperties, SceneGraphNode } from "./types"

const serialize = (children: Array<any>) => {
    const dataParent: Array<SceneGraphNode> = []
    for (const child of children) {
        if (hiddenAppendables.has(child)) continue

        const { componentName, schema, defaults } = child.constructor

        const data: Record<string, any> = { type: componentName }
        for (const key of Object.keys(schema)) {
            if (nonSerializedProperties.includes(key)) continue

            let value: any
            if (key === "animations") {
                value = child.serializeAnimations
                if (!value) continue
            } else if (key === "animation") {
                value = child.serializeAnimation
                if (value === undefined) continue
            } else value = child[key]

            if (
                value === getDefaultValue(defaults, key) ||
                typeof value === "function"
            )
                continue

            if (typeof value === "number") value = Number(value.toFixed(2))
            data[key] = value
        }
        child.children && (data.children = serialize(child.children))
        dataParent.push(data as SceneGraphNode)
    }
    return dataParent
}

export default (
    children: Array<Appendable> | Set<Appendable> | Appendable = appendableRoot
) => {
    if (children instanceof Appendable) return serialize([children])

    const childs: Array<Appendable> = []
    for (const child of children)
        !(child instanceof Setup) && childs.push(child)

    const setup = new Setup(true)
    Object.assign(setup, settings)
    childs.push(setup)

    const result = serialize(childs)
    setup.dispose()

    return result
}
