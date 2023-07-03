import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import getDisplayName from "../utils/getDisplayName"
import Setup from "../../display/Setup"
import addSetupInputs from "./addSetupInputs"
import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import useInitCSS from "../hooks/useInitCSS"
import { useSignal } from "@preact/signals"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { DEBUG } from "../../globals"
import useInitEditor from "../hooks/useInitEditor"
import addTargetInputs from "./addTargetInputs"
import TextBox from "../component/TextBox"
import usePane from "./usePane"
import mergeRefs from "../hooks/mergeRefs"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { stopPropagation } from "../utils/stopPropagation"
import { onEditorRefresh } from "../../events/onEditorRefresh"
import { multipleSelectionTargets } from "../../collections/multipleSelectionTargets"
import { FolderApi } from "./tweakpane"
import SystemsComboList from "./SystemComboList"
import { defaultSetupPtr } from "../../pointers/defaultSetupPtr"
import { editorWidthSignal } from "../signals/sizeSignals"

const Editor = () => {
    useInitCSS()
    useInitEditor()

    useLayoutEffect(() => {
        if (!DEBUG) {
            window.onbeforeunload = confirmExit
            function confirmExit() {
                return "Are you sure you want to close the current page?"
            }
        }
    }, [])

    const [pane, setContainer, container] = usePane()
    const [systemsFolderElement, setSystemsFolderElement] =
        useState<HTMLDivElement>()

    const selectionTarget = useSyncState(getSelectionTarget)
    const selectedSignal = useSignal<Array<string>>([])

    const [includeKeys, setIncludeKeys] = useState<Array<string>>()
    const [refresh, setRefresh] = useState({})

    useEffect(() => {
        const handle = onEditorRefresh(() => setRefresh({}))
        return () => {
            handle.cancel()
        }
    }, [])

    useLayoutEffect(() => {
        if (!pane || multipleSelectionTargets.size || !container) return
        if (
            selectedSignal.value.at(-1) === "Settings" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            const handle = addSetupInputs(pane, includeKeys)
            return () => {
                handle?.cancel()
            }
        }
        let systemsFolder: FolderApi | undefined
        if (!includeKeys) {
            systemsFolder = pane.addFolder({ title: "systems" })
            setSystemsFolderElement(
                container.querySelector(".tp-fldv .tp-brkv") as HTMLDivElement
            )
        }
        const handle0 = addTargetInputs(pane, selectionTarget, includeKeys)
        const handle1 = selectionTarget.$events.on("runtimeSchema", () =>
            setRefresh({})
        )
        return () => {
            systemsFolder?.dispose()
            handle0.cancel()
            handle1.cancel()
        }
    }, [selectionTarget, selectedSignal.value, includeKeys, pane, refresh])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{ width: editorWidthSignal.value, height: "100%" }}
        >
            <AppBar>
                <CloseableTab selectedSignal={selectedSignal}>
                    Settings
                </CloseableTab>
                {selectionTarget && (
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        key={selectionTarget.uuid}
                        selected
                        onClose={() => emitSelectionTarget(undefined)}
                    >
                        {getDisplayName(selectionTarget)}
                    </CloseableTab>
                )}
            </AppBar>
            <TextBox
                onChange={(val) => {
                    if (!val) {
                        setIncludeKeys(undefined)
                        return
                    }
                    const target = selectionTarget ?? defaultSetupPtr[0]
                    if (!target) return
                    val = val.toLowerCase()
                    setIncludeKeys(
                        Object.keys(getStaticProperties(target).schema).filter(
                            (key) => key.toLowerCase().includes(val)
                        )
                    )
                }}
                clearOnChange={selectedSignal.value.at(-1)}
            />
            {systemsFolderElement && (
                <SystemsComboList systemsFolderElement={systemsFolderElement} />
            )}
            <div
                style={{
                    flexGrow: 1,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    paddingLeft: 8,
                    paddingRight: 8,
                    border:
                        selectionTarget &&
                        selectedSignal.value.at(-1) !== "Settings"
                            ? "1px solid rgba(255, 255, 255, 0.2)"
                            : undefined
                }}
                ref={mergeRefs(stopPropagation, setContainer)}
            />
        </div>
    )
}
export default Editor
