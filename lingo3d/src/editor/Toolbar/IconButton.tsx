import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

type IconButtonProps = {
    children: JSX.Element
    onClick?: () => void
    active?: boolean
    disabled?: boolean
}

const IconButton = ({
    children,
    onClick,
    active,
    disabled
}: IconButtonProps) => {
    return (
        <div
            style={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 6,
                borderRadius: 4,
                background: active ? "rgba(255, 255, 255, 0.1)" : undefined,
                opacity: disabled ? 0.25 : active ? 1 : 0.75,
                cursor: "pointer"
            }}
            onClick={disabled || active ? undefined : onClick}
        >
            {children}
        </div>
    )
}

export default IconButton
