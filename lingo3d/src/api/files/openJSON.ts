import { appendableRoot } from "../core/Appendable"
import deserialize from "../serializer/deserialize"

export default async () => {
    const { fileOpen } = await import("browser-fs-access")

    const blob = await fileOpen({ extensions: [".json"] })
    const text = await blob.text()

    for (const child of appendableRoot) child.dispose()

    try {
        deserialize(JSON.parse(text))
    } catch {}
}
