import { debounce } from "@lincode/utils"
import { Pane } from "tweakpane"
import resetIcon from "./resetIcon"
import Defaults from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import toFixed from "../../api/serializer/toFixed"
import Options from "../../interface/utils/Options"

let programmatic = false

let leading = true
export const setProgrammatic = debounce(
    () => {
        programmatic = leading
        leading = !leading
    },
    100,
    "both"
)

const isPoint = (v: any): v is { x: number; y: number; z?: number } =>
    v && typeof v === "object" && "x" in v && "y" in v

const isTrue = (v: any) => v === true || v === "true"
const isFalse = (v: any) => v === false || v === "false"

const isEqual = (a: any, b: any) => {
    if (isPoint(a) && isPoint(b))
        return a.x === b.x && a.y === b.y && a.z === b.z

    if (isTrue(a) && isTrue(b)) return true
    if (isFalse(a) && isFalse(b)) return true

    return a === b
}

const numberChars = new Set("01234567890._".split(""))

export default (
    pane: Pane,
    title: string,
    target: Record<string, any>,
    defaults: Defaults<any>,
    params = { ...target },
    options?: Options<any>
) => {
    const paramsBackup = { ...params }
    const paramsDefault: typeof params = {}
    for (const key of Object.keys(params))
        params[key] = paramsDefault[key] = getDefaultValue(defaults, key, true)

    const folder = pane.addFolder({ title })

    const result = Object.fromEntries(
        Object.keys(params).map((key) => {
            const input = folder.addInput(params, key, options?.[key] as any)

            const resetButton = resetIcon.cloneNode(true) as HTMLElement
            input.element.prepend(resetButton)
            resetButton.style.opacity = "0.1"

            const updateResetButton = debounce(
                () => {
                    const unchanged = isEqual(params[key], paramsDefault[key])
                    resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                    resetButton.style.cursor = unchanged ? "auto" : "pointer"
                },
                100,
                "trailing"
            )
            updateResetButton()

            resetButton.onclick = () => {
                params[key] = JSON.parse(JSON.stringify(paramsDefault[key]))
                input.refresh()
            }

            input.on("change", ({ value }) => {
                updateResetButton()

                if (programmatic) return

                if (typeof value === "string") {
                    if (value === "true" || value === "false") {
                        target[key] = value === "true" ? true : false
                        return
                    }
                    if ([...value].every((char) => numberChars.has(char))) {
                        target[key] = parseFloat(value)
                        return
                    }
                }
                target[key] =
                    typeof value === "number" ? toFixed(key, value) : value
            })
            return [key, input] as const
        })
    )
    Object.assign(params, paramsBackup)
    setProgrammatic()
    for (const input of Object.values(result)) input.refresh()

    return result
}
