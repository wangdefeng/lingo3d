import { useState } from "preact/hooks"
import { APPBAR_HEIGHT } from "../../globals"
import { Signal } from "@preact/signals"
import { ComponentChildren } from "preact"

type MenuItemProps = {
    disabled?: boolean
    highlight?: boolean
    onClick?: (e: MouseEvent) => void
    children: ComponentChildren
    compact?: boolean
    padding?: number
    cursor?: string
    activeSignal?: Signal<any>
}

const MenuButton = ({
    disabled,
    highlight,
    onClick,
    children,
    compact,
    padding,
    cursor = "pointer",
    activeSignal
}: MenuItemProps) => {
    const [hover, setHover] = useState(false)

    if (!onClick) disabled = true

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: compact ? "100%" : APPBAR_HEIGHT,
                paddingLeft: padding ?? 20,
                paddingRight: padding ?? 20,
                paddingTop: padding,
                paddingBottom: padding,
                whiteSpace: "nowrap",
                background: disabled
                    ? undefined
                    : hover
                    ? "rgba(255, 255, 255, 0.1)"
                    : highlight
                    ? "rgba(255, 255, 255, 0.2)"
                    : activeSignal?.value
                    ? "rgba(255, 255, 255, 0.1)"
                    : undefined,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? undefined : cursor
            }}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={disabled ? undefined : () => setHover(true)}
            onMouseLeave={disabled ? undefined : () => setHover(false)}
        >
            {children}
        </div>
    )
}
export default MenuButton
