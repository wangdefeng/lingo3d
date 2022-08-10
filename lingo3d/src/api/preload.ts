import { getExtensionType } from "@lincode/filetypes"
import { assertExhaustive, splitFileName } from "@lincode/utils"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/bytesLoaded"
import { lazyLoadFBX, lazyLoadGLTF } from "../display/utils/loaders/lazyLoad"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import { getLoadingCount } from "../states/useLoadingCount"

export default async (
    urls: Array<string>,
    total: number | string,
    onProgress?: (value: number) => void
) => {
    const promises: Array<Promise<any>> = []

    let totalBytes = 0
    if (typeof total === "number") totalBytes = total
    else {
        total = total.toLowerCase()
        if (total.endsWith("kb")) totalBytes = parseFloat(total) * 1024
        else if (total.endsWith("mb"))
            totalBytes = parseFloat(total) * 1024 * 1024
        else if (total.endsWith("gb"))
            totalBytes = parseFloat(total) * 1024 * 1024 * 1024
        else throw new Error("invalid preload total value: " + total)
    }

    const handleLoadedBytesChanged = (bytes: number) => {
        onProgress?.(
            totalBytes <= 0 ? 0 : Math.min((bytes / totalBytes) * 100, 99)
        )
    }
    addLoadedBytesChangedEventListeners(handleLoadedBytesChanged)

    for (const url of urls) {
        const filetype = getExtensionType(url)
        if (!filetype) continue

        switch (filetype) {
            case "image":
                promises.push(loadTexturePromise(url))
                break

            case "model":
                const extension = splitFileName(url)[1]?.toLowerCase()
                if (extension === "fbx")
                    promises.push((await lazyLoadFBX()).default(url, false))
                else if (extension === "gltf" || extension === "glb")
                    promises.push((await lazyLoadGLTF()).default(url, false))
                break

            case "audio":
            case "plainText":
            case "scene":
                break

            default:
                assertExhaustive(filetype)
        }
    }

    await Promise.all(promises)

    removeLoadedBytesChangedEventListeners(handleLoadedBytesChanged)

    await new Promise<void>((resolve) => {
        getLoadingCount((count, handle) => {
            if (count > 0) return
            handle.cancel()
            resolve()
        })
    })
    onProgress?.(100)
}
