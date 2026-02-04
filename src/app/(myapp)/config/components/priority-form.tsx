import { IGRPButton, IGRPIcon, IGRPInputText, IGRPLabel, IGRPSeparator, IGRPTableBodyPrimitive, IGRPTableCellPrimitive, IGRPTableHeaderPrimitive, IGRPTableHeadPrimitive, IGRPTablePrimitive, IGRPTableRowPrimitive } from "@igrp/igrp-framework-react-design-system"

function PriorityForm({ priorityOptions,
    updatePriorityOption,
    removePriorityOption,
    addPriorityOption,
    newPriorityLabel,
    setNewPriorityLabel,
    newPriorityValue,
    setNewPriorityValue,
}: {
    priorityOptions: any,
    updatePriorityOption: (index: number, field: string, value: string) => void,
    removePriorityOption: (index: number) => void,
    addPriorityOption: () => void,
    newPriorityLabel: string,
    setNewPriorityLabel: (value: string) => void,
    newPriorityValue: string,
    setNewPriorityValue: (value: string) => void
}) {
    return (
        <>
            {(priorityOptions || []).length > 0 ? (<IGRPTablePrimitive>
                <IGRPTableHeaderPrimitive>
                    <IGRPTableRowPrimitive>
                        <IGRPTableHeadPrimitive className="w-12"></IGRPTableHeadPrimitive>
                        <IGRPTableHeadPrimitive>Label</IGRPTableHeadPrimitive>
                        <IGRPTableHeadPrimitive className="w-32">Value</IGRPTableHeadPrimitive>
                        <IGRPTableHeadPrimitive className="w-16"></IGRPTableHeadPrimitive>
                    </IGRPTableRowPrimitive>
                </IGRPTableHeaderPrimitive>
                <IGRPTableBodyPrimitive>
                    {(priorityOptions || []).map((option: any, index: number) => (
                        <IGRPTableRowPrimitive key={index}>
                            <IGRPTableCellPrimitive>
                                <IGRPIcon iconName="grip-vertical" className="h-4 w-4 text-muted-foreground" />
                            </IGRPTableCellPrimitive>
                            <IGRPTableCellPrimitive>
                                <IGRPInputText
                                    value={option.label}
                                    onChange={(e) => updatePriorityOption(index, "label", e.target.value)}
                                    className="h-8"
                                />
                            </IGRPTableCellPrimitive>
                            <IGRPTableCellPrimitive>
                                <IGRPInputText
                                    type="number"
                                    value={option.value}
                                    onChange={(e) => updatePriorityOption(index, "value", e.target.value)}
                                    className="h-8"
                                />
                            </IGRPTableCellPrimitive>
                            <IGRPTableCellPrimitive>
                                <IGRPButton
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePriorityOption(index)}
                                    className="h-8 w-8"
                                >
                                    <IGRPIcon iconName="trash" className="h-4 w-4 text-destructive" />
                                </IGRPButton>
                            </IGRPTableCellPrimitive>
                        </IGRPTableRowPrimitive>
                    ))}
                </IGRPTableBodyPrimitive>
            </IGRPTablePrimitive>
            )
                : (
                    <p className="text-sm text-muted-foreground text-center py-4">No priority options defined</p>
                )}

            <IGRPSeparator />

            {/* Add New Priority Option */}
            <div className="space-y-2">
                <IGRPLabel label="Add Priority Option"></IGRPLabel>
                <div className="flex gap-2">
                    <IGRPInputText
                        placeholder="Label (e.g., High)"
                        value={newPriorityLabel}
                        onChange={(e) => setNewPriorityLabel(e.target.value)}
                        className="flex-1"
                    />
                    <IGRPInputText
                        type="number"
                        placeholder="Value (e.g., 1)"
                        value={newPriorityValue}
                        onChange={(e) => setNewPriorityValue(e.target.value)}
                        className="w-32"
                    />
                    <IGRPButton onClick={addPriorityOption} size="icon" iconName="Plus">
                    </IGRPButton>
                </div>
            </div>
        </>
    )
}

export { PriorityForm }