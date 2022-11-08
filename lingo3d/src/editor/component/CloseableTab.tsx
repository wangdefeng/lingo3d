import { pull } from "@lincode/utils"
import { useContext, useEffect, useLayoutEffect } from "preact/hooks"
import CloseIcon from "./icons/CloseIcon"
import { TabContext, TabProps } from "./Tab"
import TitleBarButton from "./TitleBarButton"

type CloseableTabProps = TabProps & {
    onClose?: (selected: boolean) => void
}

const CloseableTab = ({
    onClose,
    children,
    selected,
    disabled
}: CloseableTabProps) => {
    const context = useContext(TabContext)

    useLayoutEffect(() => {
        if (!children) return
        context.tabs.push(children)
        return () => {
            context.setSelected(
                context.tabs[context.tabs.indexOf(children) - 1]
            )
            pull(context.tabs, children)
        }
    }, [])

    useEffect(() => {
        if (!disabled || !children) return
        context.setSelected(context.tabs[context.tabs.indexOf(children) - 1])
    }, [disabled])

    useEffect(() => {
        selected && context.setSelected(children)
    }, [])

    return (
        <div
            className="lingo3d-bg"
            style={{
                opacity: disabled ? 0.1 : 1,
                pointerEvents: disabled ? "none" : "auto",
                marginLeft: 4,
                marginRight: 4,
                height: 20,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                background:
                    context.selected === children
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={disabled ? undefined : () => context.setSelected(children)}
        >
            <div style={{ marginTop: -2, minWidth: 30 }}>{children}</div>
            <div style={{ width: 4 }} />
            <TitleBarButton
                disabled={!onClose}
                onClick={() => onClose?.(context.selected === children)}
            >
                <CloseIcon />
            </TitleBarButton>
        </div>
    )
}

export default CloseableTab
