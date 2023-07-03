import { getFileCurrent } from "../../states/useFileCurrent"
import {
    getFileStructure,
    setFileStructure
} from "../../states/useFileStructure"
import { unset } from "@lincode/utils"
import { getFileSelected } from "../../states/useFileSelected"
import { pathFileMap } from "../../collections/pathFileMap"
import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import { unloadFile } from "./unloadFile"
import { pathObjectURLMap } from "../../collections/pathObjectURLMap"

export default async () => {
    const file = getFileSelected() as FileWithDirectoryAndFileHandle
    //@ts-ignore
    file.handle!.remove()

    const fileStructure = getFileStructure()
    unset(fileStructure, file.webkitRelativePath.split("/"))
    pathFileMap.delete(file.webkitRelativePath)
    pathObjectURLMap.delete(file.webkitRelativePath)
    setFileStructure({ ...fileStructure })

    file === getFileCurrent() && unloadFile()
}
