import { IGRPButton, IGRPInputText, IGRPLabel } from "@igrp/igrp-framework-react-design-system"
import { useId } from "react";

function AddItem(
    { setValue, addItem, value, label, placeholder }:
        { setValue: (value: string) => void, addItem: (value: string) => void, value: string, label: string, placeholder: string }) {
    const id = useId()

    return (
        <div className="space-y-2 " >
            <IGRPLabel htmlFor={id} label={label} />
            <div className="flex gap-2">
                <IGRPInputText
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addItem(value)
                            setValue("")
                        }
                    }}
                    className="flex-1"
                />
                <IGRPButton
                    onClick={() => {
                        addItem(value)
                        setValue("")
                    }}
                    size="icon"
                    iconName="Plus"
                />
            </div>
        </div>
    );
}

export { AddItem }