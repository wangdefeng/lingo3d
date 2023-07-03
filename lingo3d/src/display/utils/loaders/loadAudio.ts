import { forceGet } from "@lincode/utils"
import { AudioLoader } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { busyCountPtr } from "../../../pointers/busyCountPtr"

const cache = new Map<string, Promise<AudioBuffer>>()
const loader = new AudioLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<AudioBuffer>((resolve, reject) => {
                busyCountPtr[0]++
                loader.load(
                    url,
                    (buffer) => {
                        busyCountPtr[0]--
                        resolve(buffer)
                    },
                    handleProgress(url),
                    () => {
                        busyCountPtr[0]--
                        reject()
                    }
                )
            })
    )
