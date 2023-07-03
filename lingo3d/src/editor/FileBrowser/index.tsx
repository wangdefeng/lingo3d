import { useMemo } from "preact/hooks"
import { get } from "@lincode/utils"
import FileButton from "./FileButton"
import FileTreeItem from "./FileTreeItem"
import useInitCSS from "../hooks/useInitCSS"
import { APPBAR_HEIGHT, PANELS_HEIGHT } from "../../globals"
import { getFileSelected, setFileSelected } from "../../states/useFileSelected"
import useSyncState from "../hooks/useSyncState"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import useInitEditor from "../hooks/useInitEditor"
import { getFileStructure } from "../../states/useFileStructure"
import FileBrowserAddContextMenu from "./FileBrowserAddContextMenu"
import FileBrowserMaterialContextMenu from "./FileBrowserMaterialContextMenu"
import { sceneGraphWidthSignal } from "../signals/sizeSignals"

const FileBrowser = () => {
    useInitCSS()
    useInitEditor()

    const fileBrowserDir = useSyncState(getFileBrowserDir)
    const fileStructure = useSyncState(getFileStructure)
    const fileSelected = useSyncState(getFileSelected)

    const filteredFiles = useMemo(() => {
        const currentFolder = get(fileStructure, fileBrowserDir.split("/"))
        const filteredFiles: Array<File> | undefined =
            currentFolder &&
            Object.values(currentFolder).filter(
                (item) => item instanceof File && item.name[0] !== "."
            )
        return filteredFiles
    }, [fileStructure, fileBrowserDir])

    const rootFolderName = useMemo(
        () => Object.keys(fileStructure)[0] ?? "",
        [fileStructure]
    )

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-panels"
                style={{
                    height: PANELS_HEIGHT - APPBAR_HEIGHT,
                    width: "100%",
                    display: "flex"
                }}
            >
                <div
                    style={{
                        overflow: "scroll",
                        width: sceneGraphWidthSignal.value
                    }}
                >
                    <FileTreeItem
                        fileStructure={fileStructure}
                        rootFolderName={rootFolderName}
                    />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <div
                        className="lingo3d-absfull"
                        style={{
                            overflow: "scroll",
                            display: "flex",
                            flexWrap: "wrap",
                            paddingBottom: 28
                        }}
                        onMouseDown={() => setFileSelected(undefined)}
                    >
                        {filteredFiles?.map((file) => (
                            <FileButton key={file.name} file={file} />
                        ))}
                    </div>
                    {fileSelected && (
                        <div
                            className="lingo3d-bg-dark"
                            style={{
                                position: "absolute",
                                bottom: 8,
                                width: "100%",
                                alignItems: "center",
                                display: "flex",
                                paddingLeft: 8,
                                paddingBottom: 8
                            }}
                        >
                            <div style={{ opacity: 0.5 }}>
                                {fileSelected.name}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FileBrowserAddContextMenu />
            <FileBrowserMaterialContextMenu />
        </>
    )
}
export default FileBrowser
