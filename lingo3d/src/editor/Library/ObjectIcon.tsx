import { preventTreeShake, upperFirst } from "@lincode/utils"
import { h } from "preact"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import { container } from "../../engine/renderLoop/renderSetup"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { point2Vec } from "../../display/utils/vec2Point"
import clientToWorld from "../../display/utils/clientToWorld"

preventTreeShake(h)

let draggingItem: string | undefined

container.addEventListener("dragover", (e) => e.preventDefault())
container.addEventListener("dragenter", (e) => e.preventDefault())
container.addEventListener("drop", (e) => {
    if (!draggingItem) return
    const manager = createObject(draggingItem as GameObjectType)
    manager.outerObject3d.position.copy(
        point2Vec(clientToWorld(e.clientX, e.clientY))
    )
    emitSelectionTarget(manager)
})

type ObjectIconProps = {
    name: string
    iconName?: string
}

const ObjectIcon = ({ name, iconName = name }: ObjectIconProps) => {
    return (
        <div
            onDragStart={() => (draggingItem = name)}
            onDragEnd={() => (draggingItem = undefined)}
            style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20
            }}
        >
            <img
                style={{ width: 50, height: 50 }}
                src={`https://unpkg.com/lingo3d-editor@1.0.2/assets/${iconName}.png`}
            />
            <div
                style={{
                    marginTop: 6,
                    opacity: 0.75,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%"
                }}
            >
                {upperFirst(name)}
            </div>
        </div>
    )
}

export default ObjectIcon
