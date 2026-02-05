import {
  IGRPCheckbox,
  IGRPLabel,
} from "@igrp/igrp-framework-react-design-system";
import { ScrollArea } from "@igrp/igrp-framework-react-design-system/dist/components/primitives/scroll-area";

function AddChecklistItem({
  addItem,
  removeItem,
  label,
  availableItems,
  items,
}: {
  addItem: (value: string) => void;
  removeItem: (value: string) => void;
  label: string;
  availableItems?: string[];
  items?: any;
}) {
  return (
    <div className="space-y-2">
      <IGRPLabel label={label} />
      {availableItems && availableItems?.length > 0 ? (
        <ScrollArea className="h-48 border rounded-md p-3">
          <div className="space-y-2">
            {(availableItems || []).map((group) => (
              <div key={group} className="flex items-center justify-between py-1">
                <IGRPLabel
                  htmlFor={`process-group-${group}`}
                  label={group}
                  className="flex-1 cursor-pointer"
                />
                <IGRPCheckbox
                  id={`process-group-${group}`}
                  checked={items.includes(group)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addItem(group);
                    } else {
                      removeItem(group);
                    }
                  }}
                />
              </div>
            ))}

          </div>
        </ScrollArea>
      ) : (
        <div className="border rounded-md p-3 py-6 border-dashed flex items-center justify-center text-center text-muted-foreground">
          <IGRPLabel label="Any group available, use the custom group" />
        </div>
      )}
    </div>
  );
}

export { AddChecklistItem };
