import { IGRPButton } from "@igrp/igrp-framework-react-design-system";
import {
  IGRPDropdownMenuPrimitive,
  IGRPDropdownMenuContentPrimitive,
  IGRPDropdownMenuGroupPrimitive,
  IGRPDropdownMenuItemPrimitive,
  IGRPDropdownMenuSeparatorPrimitive,
  IGRPDropdownMenuTriggerPrimitive,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";

export function ActionsItem() {
  return (
    <IGRPDropdownMenuPrimitive>
      <IGRPDropdownMenuTriggerPrimitive asChild>
        <IGRPButton variant="outline">
          <IGRPIcon iconName="EllipsisVertical" />
        </IGRPButton>
      </IGRPDropdownMenuTriggerPrimitive>
      <IGRPDropdownMenuContentPrimitive>
        <IGRPDropdownMenuGroupPrimitive>
          <IGRPDropdownMenuItemPrimitive>
            <IGRPIcon iconName="Download" />
            Export
          </IGRPDropdownMenuItemPrimitive>
        </IGRPDropdownMenuGroupPrimitive>
        <IGRPDropdownMenuSeparatorPrimitive />
        <IGRPDropdownMenuGroupPrimitive>
          <IGRPDropdownMenuItemPrimitive variant="destructive">
            <IGRPIcon iconName="Archive" />
            Archive
          </IGRPDropdownMenuItemPrimitive>
        </IGRPDropdownMenuGroupPrimitive>
      </IGRPDropdownMenuContentPrimitive>
    </IGRPDropdownMenuPrimitive>
  );
}
