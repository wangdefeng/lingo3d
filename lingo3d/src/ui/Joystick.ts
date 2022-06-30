import EventLoopItem from "../api/core/EventLoopItem"
import nipplejs from "nipplejs"
import { container } from "../engine/renderLoop/renderSetup"
import IJoystick from "../interface/IJoystick"
import { Point } from "@lincode/math"
import Nullable from "../interface/utils/Nullable"

export default class Joystick extends EventLoopItem implements IJoystick {
    public onMove: Nullable<(e: Point) => void>
    public onMoveStart: Nullable<(e: Point) => void>
    public onMoveEnd: Nullable<(e: Point) => void>

    public constructor() {
        super()

        this.createEffect(() => {
            const manager = nipplejs.create({
                zone: container
            })

            // manager.on("start", (e: any) => {
            //     this.onMoveStart?.(e.position)
            // })

            // manager.on("move", (e: any) => {

            // })

            // manager.on("end", (e: any) => {

            // })

            return () => {
                manager.destroy()
            }
        }, [/* this.variantState.get */])
    }

    // private variantState = new Reactive<1 | 2 | 3 | 4>(1)
    // public get variant(): 1 | 2 | 3 | 4 {
    //     return this.variantState.get()
    // }
    // public set variant(value: 1 | 2 | 3 | 4) {
    //     this.variantState.set(value)
    // }
}