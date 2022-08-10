import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import MenuButton from "./MenuButton"
import ContextMenu from "../ContextMenu"
import MenuItem from "../ContextMenu/MenuItem"
import { useState } from "preact/hooks"
import { setNodeEditor } from "../../states/useNodeEditor"
import { useNodeEditor } from "../states"
import useInit from "../utils/useInit"

preventTreeShake(h)

type Data = {
    x: number
    y: number
    menuItems: Array<{ text: string; onClick?: () => void }>
}

const Menu = () => {
    const elRef = useInit()
    const [data, setData] = useState<Data | undefined>()
    const [nodeEditor] = useNodeEditor()

    return (
        <div
            ref={elRef}
            className="lingo3d-ui"
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: 25,
                background: "rgb(35, 36, 41)",
                marginTop: -20,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
            }}
        >
            <ul
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "start"
                }}
            >
                <MenuButton
                    onClick={(e) =>
                        setData({
                            x: e.left,
                            y: e.top,
                            menuItems: [
                                {
                                    text: "open...",
                                    onClick: () =>
                                        console.log("first button clicked")
                                }
                            ]
                        })
                    }
                >
                    File
                </MenuButton>
                <MenuButton
                    onClick={(e) =>
                        setData({
                            x: e.left,
                            y: e.top,
                            menuItems: [
                                {
                                    text: nodeEditor
                                        ? "hide nodes editor"
                                        : "show nodes editor",
                                    onClick: () => {
                                        setData(undefined)
                                        setNodeEditor(!nodeEditor)
                                    }
                                }
                            ]
                        })
                    }
                >
                    View
                </MenuButton>
            </ul>
            <ContextMenu data={data} setData={setData}>
                {data?.menuItems.map((item) => (
                    <MenuItem setData={setData} onClick={item.onClick}>
                        {item.text}
                    </MenuItem>
                ))}
            </ContextMenu>
        </div>
    )
}
export default Menu

register(Menu, "lingo3d-menu")
