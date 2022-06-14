import { endPoint, Point3d, rad2Deg, rotatePoint } from "@lincode/math"
import store, { Reactive } from "@lincode/reactivity"
import { Vector3 } from "three"
import { interpret } from "xstate"
import { loop } from "../../engine/eventLoop"
import { onBeforeRender } from "../../events/onBeforeRender"
import IDummy, { dummyDefaults, dummySchema } from "../../interface/IDummy"
import FoundManager from "../core/FoundManager"
import AnimationManager from "../core/mixins/AnimationMixin/AnimationManager"
import Model from "../Model"
import { point2Vec } from "../utils/vec2Point"
import poseMachine from "./poseMachine"

const assetsUrl = "https://unpkg.com/lingo3d-dummy@1.0.2/assets/"

export default class Dummy extends Model implements IDummy {
    public static override componentName = "dummy"
    public static override defaults = dummyDefaults
    public static override schema = dummySchema

    private poseService = interpret(poseMachine)

    public constructor () {
        super()
        this.width = 20
        this.depth = 20
        this.scale = 1.7
        this.pbr = true
        this.frustumCulled = false

        const [setType, getType] = store<"mixamo" | "readyplayerme" | undefined>(undefined)
        const [setSpine, getSpine] = store<FoundManager | undefined>(undefined)

        this.createEffect(() => {
            const spineName = this.spineNameState.get()
            super.src = this.srcState.get()
            setSpine(undefined)
            setType(undefined)

            const handle = this.loaded.then(loaded => {
                if (spineName) {
                    setSpine(this.find(spineName, true))

                    if (spineName === "mixamorigSpine")
                        setType("mixamo")
                    else if (spineName === "Spine" && loaded.getObjectByName("Wolf3D_Body"))
                        setType("readyplayerme")

                    return
                }
                if (loaded.getObjectByName("Wolf3D_Body")) {
                    setSpine(this.find("Spine", true))
                    setType("readyplayerme")
                    return
                }
                const spine = this.find("mixamorigSpine", true)
                setSpine(spine)
                spine && setType("mixamo")
            })
            return () => {
                handle.cancel()
            }
        }, [this.srcState.get, this.spineNameState.get])

        const [setPose, getPose] = store("idle")

        this.createEffect(() => {
            const preset = this.presetState.get()
            const prefix = preset === "rifle" ? "rifle-" : ""

            const type = getType()
            const src = this.srcState.get()

            let url = ""
            if (type === "readyplayerme")
                url = assetsUrl + "readyplayerme/"
            else {
                const parts = src.split("/")
                parts.pop()
                url = parts.join("/") + "/"
            }

            super.animations = {
                idle: url + prefix + "idle.fbx",
                running: url + prefix + "running.fbx",
                runningBackwards: url + prefix + "running-backwards.fbx",
                jumping: url + prefix + "falling.fbx",
                ...this.animationsState.get()
            }
            this.animation = getPose()
            
            return () => {
                this.animation = undefined
            }
        }, [this.presetState.get, this.srcState.get, getType, this.animationsState.get])
        
        const { poseService } = this
        this.createEffect(() => {
            const pose = this.animation = getPose()
            if (pose !== "jumping") return

            this.velocity.y = this.jumpHeight

            const handle = loop(() => {
                this.velocity.y === 0 && poseService.send("JUMP_STOP")
            })
            return () => {
                handle.cancel()
            }
        }, [getPose])
        poseService.onTransition(state => state.changed && setPose(state.value as string)).start()
        this.then(() => poseService.stop())

        let groupVecOld: Vector3 | undefined

        const computeAngle = (angle: number) => {
            const thisPoint = this.pointAt(1000)
            const centerPoint = this.getWorldPosition()
            const rotated = rotatePoint({ x: thisPoint.x, y: thisPoint.z }, { x: centerPoint.x, y: centerPoint.z }, angle)
            return point2Vec(new Point3d(rotated.x, thisPoint.y, rotated.y))
        }

        this.createEffect(() => {
            const spine = getSpine()
            if (!spine) return

            const spineQuaternion = spine.outerObject3d.quaternion.clone()
            const loadedGroupQuaternion = this.loadedGroup.quaternion.clone()

            const { strideForward, strideRight, strideMove } = this
            if (!strideForward && !strideRight) {
                const thisPoint = this.pointAt(1000)
                this.loadedGroup.lookAt(point2Vec(thisPoint))
                poseService.send("RUN_STOP")
                groupVecOld = undefined
                return
            }

            const backwards = strideForward > 0

            const sf = backwards ? -strideForward : strideForward
            const sr = backwards ? -strideRight : strideRight
            const angle = 90 - Math.atan2(-sf, -sr) * rad2Deg

            const handle = onBeforeRender(() => {
                poseService.send(backwards ? "RUN_BACKWARDS_START" : "RUN_START")

                this.loadedGroup.quaternion.copy(loadedGroupQuaternion)
                spine.outerObject3d.quaternion.copy(spineQuaternion)
                const spinePoint = spine.pointAt(1000)
                
                const groupVecNew = computeAngle(angle)
                const groupVec = (groupVecOld ?? computeAngle(0)).lerp(groupVecNew, 0.1)
                this.loadedGroup.lookAt(groupVec)
                groupVecOld = groupVec

                spine.lookAt(spinePoint)

                if (!strideMove) return

                const { x, y } = endPoint(0, 0, angle + 90, Math.max(Math.abs(strideForward), Math.abs(strideRight)))
                this.moveForward(backwards ? y : -y)
                this.moveRight(backwards ? -x : x)
            })
            return () => {
                handle.cancel()
                spine.outerObject3d.quaternion.copy(spineQuaternion)
                this.loadedGroup.quaternion.copy(loadedGroupQuaternion)
            }
        }, [this.strideMoveState.get, this.strideForwardState.get, this.strideRightState.get, getSpine])
    }
    
    private spineNameState = new Reactive<string | undefined>(undefined)
    public get spineName() {
        return this.spineNameState.get()
    }
    public set spineName(val) {
        this.spineNameState.set(val)
    }

    private srcState = new Reactive(assetsUrl + "ybot.fbx")
    public override get src() {
        return this.srcState.get()
    }
    public override set src(val) {
        this.srcState.set(val)
    }

    private animationsState = new Reactive({})
    public override get animations(): Record<string, AnimationManager> {
        return super.animations
    }
    public override set animations(val: Record<string, string | AnimationManager>) {
        this.animationsState.set(val)
    }

    private presetState = new Reactive<"default" | "rifle">("default")
    public get preset() {
        return this.presetState.get()
    }
    public set preset(val) {
        this.presetState.set(val)
    }

    private strideForwardState = new Reactive(0)
    public get strideForward() {
        return this.strideForwardState.get()
    }
    public set strideForward(val) {
        this.strideForwardState.set(val)
    }

    private strideRightState = new Reactive(0)
    public get strideRight() {
        return this.strideRightState.get()
    }
    public set strideRight(val) {
        this.strideRightState.set(val)
    }
    
    private strideMoveState = new Reactive(false)
    public get strideMove() {
        return this.strideMoveState.get()
    }
    public set strideMove(val) {
        this.strideMoveState.set(val)
    }

    private jumpHeight = 10
    public jump(height = 10) {
        this.jumpHeight = height
        this.poseService.send("JUMP_START")
    }
}