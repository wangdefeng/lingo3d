import store from "@lincode/reactivity"
import { getSelectionTarget } from "./useSelectionTarget"

const [_setTimelineLayer, getTimelineLayer] = store<string | undefined>(
    undefined
)
export { getTimelineLayer }

let blocked = false
let timeout: number | undefined
export const setTimelineLayer = (val?: string) => {
    _setTimelineLayer(val)
    blocked = true
    clearTimeout(timeout)
    timeout = setTimeout(() => (blocked = false), 10)
}

getSelectionTarget(async (selectionTarget) => {
    if (blocked) return
    if (!selectionTarget) {
        _setTimelineLayer(undefined)
        return
    }
    const { getTimelineData } = await import("./useTimelineData")
    const [timelineData] = getTimelineData()
    if (!timelineData || !(selectionTarget.uuid in timelineData)) {
        _setTimelineLayer(undefined)
        return
    }
    _setTimelineLayer(selectionTarget.uuid)
})
