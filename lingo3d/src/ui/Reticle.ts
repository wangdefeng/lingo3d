import { Reactive } from "@lincode/reactivity"
import { Group } from "three"
import EventLoopItem from "../api/core/EventLoopItem"
import { container } from "../engine/renderLoop/renderSetup"
import createElement from "../utils/createElement"

export default class Reticle extends EventLoopItem {
    public constructor() {
        super(new Group())

        this.createEffect(() => {
            const variant = this.variantState.get()

            const imageElement = createElement(`
                <img
                  src="https://unpkg.com/lingo3d-textures@1.0.1/assets/reticle${variant}.png"
                  style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); pointer-events: none; user-select: none; width: 20px;"
                ></img>
            `)
            container.appendChild(imageElement)

            return () => {
                container.removeChild(imageElement)
            }
        }, [this.variantState.get])
    }

    private variantState = new Reactive<1 | 2 | 3 | 4>(1)
    public get variant(): 1 | 2 | 3 | 4 {
        return this.variantState.get()
    }
    public set variant(value: 1 | 2 | 3 | 4) {
        this.variantState.set(value)
    }
}

const reticle = new Reticle()
reticle.variant = 2