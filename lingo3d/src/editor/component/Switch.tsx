import { useEffect, useState } from "preact/hooks"

type SwitchProps = {
    label?: string
    onChange?: (on: boolean) => void
    on?: boolean
}

const Switch = ({ label, onChange, on: onProp }: SwitchProps) => {
    const [on, setOn] = useState(false)

    useEffect(() => {
        setOn(!!onProp)
    }, [onProp])

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: 4
            }}
            onClick={() => {
                setOn(!on)
                onChange?.(!on)
            }}
        >
            <div
                style={{
                    width: 40,
                    height: 20,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 999,
                    padding: 2
                }}
            >
                <div
                    style={{
                        width: 16,
                        height: 16,
                        background: "rgba(255, 255, 255, 0.5)",
                        borderRadius: 999,
                        left: on ? "calc(100% - 16px)" : 0,
                        transition: "all 100ms"
                    }}
                />
            </div>
            {label}
        </div>
    )
}
export default Switch
