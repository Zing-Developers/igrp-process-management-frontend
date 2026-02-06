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
import { useRef, useState } from "react";
import { archiveProcessDefinition, exportProcessDefinition, importProcessDefinition } from "../../client/process";
import { ProcessDefinitionSchema } from "@igrp/platform-process-management-types";

export function ActionsItem({
  processDefinitionId,
  onArchiveSuccess,
  onImportSuccess,
}: {
  processDefinitionId: string;
  onArchiveSuccess?: () => void;
  onImportSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { igrpToast } = useIGRPToast();

  const handleArchive = async () => {
    try {
      await archiveProcessDefinition(processDefinitionId);
      igrpToast({
        title: "Process definition archived successfully",
        description: "The process definition has been archived successfully",
        type: "success",
      });
      onArchiveSuccess?.();
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
      const data = await exportProcessDefinition(processDefinitionId);
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${processDefinitionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ProcessDefinitionSchema;
      await importProcessDefinition(data);
      igrpToast({
        title: "Process definition imported successfully",
        description: "The process definition has been imported successfully",
        type: "success",
      });
      onImportSuccess?.();
    } catch (error) {
      console.error(error);
      igrpToast({
        title: "Error importing process definition",
        description:
          error instanceof SyntaxError
            ? "Invalid JSON file"
            : "An error occurred while importing the process definition",
        type: "error",
      });
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />
      <IGRPDropdownMenuPrimitive>
        <IGRPDropdownMenuTriggerPrimitive asChild>
          <IGRPButton variant="outline">
            <IGRPIcon iconName="EllipsisVertical" />
          </IGRPButton>
        </IGRPDropdownMenuTriggerPrimitive>
        <IGRPDropdownMenuContentPrimitive>
          <IGRPDropdownMenuGroupPrimitive>
            {processDefinitionId && (<IGRPDropdownMenuItemPrimitive onClick={handleExport}>
              <IGRPIcon iconName="Download" />
              Export
            </IGRPDropdownMenuItemPrimitive>
            )}
            <IGRPDropdownMenuItemPrimitive onClick={handleImportClick}>
              <IGRPIcon iconName="Upload" />
              Import new
            </IGRPDropdownMenuItemPrimitive>
          </IGRPDropdownMenuGroupPrimitive>
          {processDefinitionId
            && (<>
              <IGRPDropdownMenuSeparatorPrimitive />
              <IGRPDropdownMenuGroupPrimitive >
                <IGRPDropdownMenuItemPrimitive variant="destructive" onClick={() => setIsOpen(!isOpen)}>
                  <IGRPIcon iconName="Archive" />
                  Archive
                </IGRPDropdownMenuItemPrimitive>
              </IGRPDropdownMenuGroupPrimitive>
            </>
            )}
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

