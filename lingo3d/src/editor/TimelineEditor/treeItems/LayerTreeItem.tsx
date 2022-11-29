import { ComponentChildren } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../../api/core/collections"
import { onName } from "../../../events/onName"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { FRAME_HEIGHT } from "../../../globals"
import BaseTreeItem from "../../component/treeItems/BaseTreeItem"
import {
    deleteTimelineExpandedUUID,
    addTimelineExpandedUUID
} from "../../states/useTimelineExpandedUUIDs"
import { useTimelineLayer } from "../../states/useTimelineLayer"
import getComponentName from "../../utils/getComponentName"
import useSyncDeselect from "./useSyncDeselect"

type LayerTreeItemProps = {
    children: ComponentChildren
    uuid: string
}

const LayerTreeItem = ({ children, uuid }: LayerTreeItemProps) => {
    const [layer, setLayer] = useTimelineLayer()
    const [name, setName] = useState("")
    const instance = useMemo(() => uuidMap.get(uuid), [uuid])
    const selected = layer === uuid

    useSyncDeselect(selected, instance, layer)

    useLayoutEffect(() => {
        return () => {
            deleteTimelineExpandedUUID(uuid)
        }
    }, [])

    useLayoutEffect(() => {
        if (!instance) return
        setName(getComponentName(instance))
        const handle = onName(
            (item) => item === instance && setName(getComponentName(instance))
        )
        return () => {
            handle.cancel()
        }
    }, [instance])

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={name}
            onExpand={() => addTimelineExpandedUUID(uuid)}
            onCollapse={() => deleteTimelineExpandedUUID(uuid)}
            selected={selected}
            onClick={() => setLayer(uuid)}
            onSelect={() => emitSelectionTarget(instance, false, true)}
        >
            {children}
        </BaseTreeItem>
    )
}

export default LayerTreeItem
