import IAddNode, { addNodeDefaults, addNodeSchema } from "../interface/IAddNode"
import GameGraphChild from "./GameGraphChild"

export default class AddNode extends GameGraphChild implements IAddNode {
    public static componentName = "addNode"
    public static defaults = addNodeDefaults
    public static schema = addNodeSchema
    public static includeKeys = ["add", "out", "execute"]

    public add = 1
    public out = 0

    public execute(dt = 1) {
        this.out += this.add * dt
    }
}
