import register from "preact-custom-element"
import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import useInitCSS from "../utils/useInitCSS"
import { useFileBrowser } from "../states"
import FileBrowser from "../FileBrowser"
import { useState } from "preact/hooks"
import Timeline from "../Timeline"
import RulerBar from "../Timeline/RulerBar"
import { PANELS_HEIGHT } from "../../globals"

const Panels = () => {
    useInitCSS(true)

    const [fileBrowser, setFileBrowser] = useFileBrowser()
    const [tab, setTab] = useState<string | undefined>(undefined)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: PANELS_HEIGHT,
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div style={{ display: "flex" }}>
                <AppBar onSelectTab={setTab} style={{ width: 200 }}>
                    <CloseableTab>timeline</CloseableTab>
                    <CloseableTab
                        disabled={!fileBrowser}
                        onClose={() => setFileBrowser(false)}
                        selected={!!fileBrowser}
                    >
                        files
                    </CloseableTab>
                </AppBar>
                <AppBar style={{ flexGrow: 1 }}>
                    {tab === "timeline" && <RulerBar />}
                </AppBar>
            </div>
            <div style={{ flexGrow: 1 }}>
                {tab === "files" && fileBrowser && <FileBrowser />}
                {tab === "timeline" && <Timeline />}
            </div>
        </div>
    )
}
export default Panels

register(Panels, "lingo3d-panels")
