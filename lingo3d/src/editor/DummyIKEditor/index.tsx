import { Point } from "@lincode/math"
import { useState } from "preact/hooks"
import { LIBRARY_WIDTH } from "../../globals"
import Tooltip from "../component/Tooltip"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Joint from "./Joint"
import { editorWidthSignal } from "../signals/sizeSignals"

const DummyIKEditor = () => {
    useInitCSS()
    useInitEditor()

    const [position, setPosition] = useState<Point>()

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcenter"
                style={{ width: editorWidthSignal.value + LIBRARY_WIDTH }}
            >
                <div
                    style={{
                        aspectRatio: "1 / 2",
                        width: "100%"
                    }}
                >
                    <div
                        className="lingo3d-absfull"
                        style={{
                            backgroundImage: "url(retargeter.png)",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            opacity: 0.2
                        }}
                    />
                    <Joint
                        x={0}
                        y={30}
                        name="neck"
                        onMouseMove={(e) =>
                            setPosition({ x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setPosition(undefined)}
                    />

                    <Joint x={-6} y={33} name="leftShoulder" />
                    <Joint x={6} y={33} name="rightShoulder" />

                    <Joint x={-14} y={34} name="leftArm" />
                    <Joint x={14} y={34} name="rightArm" />

                    <Joint x={-27} y={34} name="leftForeArm" />
                    <Joint x={27} y={34} name="rightForeArm" />

                    <Joint x={-41} y={34} name="leftHand" />
                    <Joint x={41} y={34} name="rightHand" />

                    <Joint x={0} y={35} name="spine2" />
                    <Joint x={0} y={38.5} name="spine1" />
                    <Joint x={0} y={43} name="spine0" />
                    <Joint x={0} y={47} name="hips" />

                    <Joint x={-6} y={48} name="leftThigh" />
                    <Joint x={6} y={48} name="rightThigh" />

                    <Joint x={-5} y={59} name="leftLeg" />
                    <Joint x={5} y={59} name="rightLeg" />

                    <Joint x={-5} y={68} name="leftFoot" />
                    <Joint x={5} y={68} name="rightFoot" />

                    <Joint x={-6} y={72} name="leftToeBase" />
                    <Joint x={6} y={72} name="rightToeBase" />
                </div>
            </div>
            <Tooltip position={position} />
        </>
    )
}
export default DummyIKEditor
