import { IGRPAlertDialog, IGRPButton, useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import {
  IGRPDropdownMenuPrimitive,
  IGRPDropdownMenuContentPrimitive,
  IGRPDropdownMenuGroupPrimitive,
  IGRPDropdownMenuItemPrimitive,
  IGRPDropdownMenuSeparatorPrimitive,
  IGRPDropdownMenuTriggerPrimitive,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";
import { archiveProcessDefinition, exportProcessDefinition } from "../../client/process";

export function ActionsItem({ processDefinitionId }: { processDefinitionId: string }) {

  const [isOpen, setIsOpen] = useState(false);

  const { igrpToast } = useIGRPToast()

  const handleArchive = async () => {
    try {
      await archiveProcessDefinition(processDefinitionId);
      igrpToast({
        title: "Process definition archived successfully",
        description: "The process definition has been archived successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      igrpToast({
        title: "Error archiving process definition",
        description: "An error occurred while archiving the process definition",
        type: "error",
      });
    } finally {
      setIsOpen(false);
    }
  }

  const handleExport = async () => {
    try {
      await exportProcessDefinition(processDefinitionId);
      igrpToast({
        title: "Process definition exported successfully",
        description: "The process definition has been exported successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      igrpToast({
        title: "Error exporting process definition",
        description: "An error occurred while exporting the process definition",
        type: "error",
      });
    }
    finally {
      setIsOpen(false);
    }
  }

  return (
    <>
      <IGRPDropdownMenuPrimitive>
        <IGRPDropdownMenuTriggerPrimitive asChild>
          <IGRPButton variant="outline">
            <IGRPIcon iconName="EllipsisVertical" />
          </IGRPButton>
        </IGRPDropdownMenuTriggerPrimitive>
        <IGRPDropdownMenuContentPrimitive>
          <IGRPDropdownMenuGroupPrimitive>
            <IGRPDropdownMenuItemPrimitive onClick={handleExport}>
              <IGRPIcon iconName="Download" />
              Export
            </IGRPDropdownMenuItemPrimitive>
          </IGRPDropdownMenuGroupPrimitive>
          <IGRPDropdownMenuSeparatorPrimitive />
          <IGRPDropdownMenuGroupPrimitive >
            <IGRPDropdownMenuItemPrimitive variant="destructive" onClick={() => setIsOpen(!isOpen)}>
              <IGRPIcon iconName="Archive" />
              Archive
            </IGRPDropdownMenuItemPrimitive>
          </IGRPDropdownMenuGroupPrimitive>
        </IGRPDropdownMenuContentPrimitive>
      </IGRPDropdownMenuPrimitive >

      <IGRPAlertDialog title="Archive" open={isOpen} onOpenChange={setIsOpen}
        description="Are you sure you want to archive this process definition?"
        iconName="Archive" showIcon={true}
        variant="destructive"
        actionLabel="Archive"
        cancelLabel="Cancel"
        onAction={handleArchive}
        onCancel={() => {
          setIsOpen(false);
        }}
      >
      </IGRPAlertDialog>
    </>
  );
}

