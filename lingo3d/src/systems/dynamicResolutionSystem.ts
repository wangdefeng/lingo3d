import { WebGLRenderer } from "three"
import math from "../math"
import toFixed from "../api/serializer/toFixed"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import { rendererPtr } from "../pointers/rendererPtr"
import { resolutionPtr } from "../pointers/resolutionPtr"
import { setPixelRatio } from "../states/usePixelRatio"
import { fpsPtr } from "../pointers/fpsPtr"
import { STANDARD_FRAME } from "../globals"
import isBusy from "../api/isBusy"
import createInternalSystem from "./utils/createInternalSystem"

const clampPixelRatio = (pixelCount: number, pixelRatio: number) => {
    const clampMin = math.mapRange(pixelCount, 200000, 2000000, 0.7, 0.5, true)
    return toFixed(math.clamp(pixelRatio, clampMin, 1), 1)
}

const sortPixelRatio = (a: number, b: number) => a - b
const SAMPLES = 20

export const dynamicResolutionSystem = createInternalSystem(
    "dynamicResolutionSystem",
    {
        data: () => ({
            pixelCount: resolutionPtr[0][0] * resolutionPtr[0][1],
            pixelRatio: Infinity,
            ratio: math.mapRange(fpsPtr[0], 0, STANDARD_FRAME, 0, 1),
            pixelRatioArray: [] as Array<number>
        }),
        update: (_: WebGLRenderer, data) => {
            if (isBusy()) return

            data.pixelRatioArray.push(
                clampPixelRatio(
                    data.pixelCount,
                    1 / (fpsRatioPtr[0] * data.ratio)
                )
            )
            if (data.pixelRatioArray.length < SAMPLES) return

            data.pixelRatioArray.sort(sortPixelRatio)
            const median = data.pixelRatioArray[Math.floor(SAMPLES * 0.4)]
            data.pixelRatioArray.length = 0

            if (median >= data.pixelRatio) return
            data.pixelRatio = median

            rendererPtr[0].setPixelRatio(median)
            setPixelRatio(median)
        }
    }
)
