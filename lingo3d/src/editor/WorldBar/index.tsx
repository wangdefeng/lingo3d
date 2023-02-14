import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import Controls from "./Controls"
import useInitEditor from "../hooks/useInitEditor"
import { useLayoutEffect } from "preact/hooks"
import { Pane } from "../Editor/tweakpane"
import useClickable from "../hooks/useClickable"
import { getManager } from "../../api/utils/getManager"
import { getCameraComputed } from "../../states/useCameraComputed"
import { getCameraList } from "../../states/useCameraList"
import { setEditorCamera } from "../../states/useEditorCamera"
import getDisplayName from "../utils/getDisplayName"
import { createEffect } from "@lincode/reactivity"
import Switch from "../component/Switch"
import useSyncState from "../hooks/useSyncState"
import { getSplitView, setSplitView } from "../../states/useSplitView"

const Tabs = () => {
    useInitCSS()
    useInitEditor()

    const splitView = useSyncState(getSplitView)
    const elRef = useClickable()

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })

        const handle = createEffect(() => {
            const cameraList = getCameraList()
            const camera = getCameraComputed()

            const label = ""

            const cameraSettings = {
                get [label]() {
                    return cameraList.indexOf(camera)
                },
                set [label](val) {
                    setEditorCamera(cameraList[val])
                }
            }
            const options: Record<string, number> = {}
            let i = 0
            for (const cam of cameraList)
                options[getDisplayName(getManager(cam)!)] = i++

            const cameraInput = pane.add(
                pane.addInput(cameraSettings, label, { options })
            )
            el.querySelector<HTMLDivElement>(".tp-lblv_v")!.style.width =
                "100px"

            return () => {
                cameraInput.dispose()
            }
        }, [getCameraList, getCameraComputed])

        return () => {
            handle.cancel()
            pane.dispose()
        }
    }, [])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-tabs"
            style={{ width: "100%" }}
        >
            <AppBar>
                <div ref={elRef} style={{ marginLeft: -20 }} />
                <Switch
                    label="split view"
                    on={splitView}
                    onChange={(val) => setSplitView(val)}
                />
                <div style={{ flexGrow: 1, minWidth: 4 }} />
                <Controls />
            </AppBar>
        </div>
    )
}
export default Tabs
