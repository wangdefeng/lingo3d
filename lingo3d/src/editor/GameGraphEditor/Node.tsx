import { valueof } from "@lincode/utils"
import { useMemo } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { GameGraphData } from "../../interface/IGameGraph"
import getDisplayName from "../utils/getDisplayName"

type NodeProps = {
    uuid: string
    data: valueof<GameGraphData>
}

const Node = ({ uuid, data }: NodeProps) => {
    const manager = useMemo(() => uuidMap.get(uuid), [uuid])
    const displayName = useMemo(
        () => manager && getDisplayName(manager),
        [manager]
    )
    if (!manager) return null

    return (
        <div
            style={{
                width: 200,
                height: 300,
                background: "rgba(255, 255, 255, 0.1)",
                position: "absolute",
                left: data.x,
                top: data.y
            }}
        >
            <div>{displayName}</div>
        </div>
    )
}

export default Node
