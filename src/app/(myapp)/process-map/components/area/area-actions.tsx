import React, { useState } from "react";
import { ProcessTreeNode } from "../../types";
import { IGRPAlertDialog, IGRPButton } from "@igrp/igrp-framework-react-design-system";
import { ExtendedArea } from "@/app/(myapp)/process-configuration/types";
import { Process } from "@igrp/platform-process-management-types";

interface NodeActionsProps {
  node: ProcessTreeNode;
  onEdit: (node: ExtendedArea | Process, parentAreaId?: string) => void;
  onDelete: (nodeId: string) => void;
  onAddSubarea: (nodeId: string) => void;
  onRemoveProcess: (nodeId: string, processId: string) => void;
}

export function AreaActions({
  node,
  onEdit,
  onDelete,
  onAddSubarea,
  onRemoveProcess,
}: NodeActionsProps) {

  const [isOpen, setIsOpen] = useState(false);

  const { type, data } = node

  const isAreaOrSubarea = type === "area" || type === "subarea";

  return (
    <div className="flex items-center space-x-1">

      {isAreaOrSubarea &&
        <>
          <IGRPButton
            onClick={(e) => {
              e.stopPropagation();
              onAddSubarea(node.id);
            }}
            title="Adicionar Subárea"
            iconName={"FolderPlus"}
            size={"icon"}
            variant={"ghost"}
          ></IGRPButton>


          <IGRPButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(data, data?.areaId ?? undefined);
            }}
            title="Editar"
            iconName={"Pencil"}
            size={"icon"}
            variant={"ghost"}
          ></IGRPButton>
        </>
      }
      <IGRPButton
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        title="Excluir"
        iconName="Trash2"
        size={"icon"}
        variant={"ghost"}
        iconClassName="text-destructive hover:text-destructive/80"
      >
      </IGRPButton>

      <IGRPAlertDialog title="Excluir" open={isOpen} onOpenChange={setIsOpen}
        description={isAreaOrSubarea ? "Tem certeza que deseja excluir esta área? Todas as subáreas também serão removidas." : "Tem certeza que deseja excluir este processo?"}
        iconName="Trash2" showIcon={true}
        variant="destructive"
        actionLabel="Excluir"
        cancelLabel="Cancel"
        onAction={() => { isAreaOrSubarea ? onDelete(node.id) : onRemoveProcess(data?.areaId ?? "", data?.id ?? "") }}
        onCancel={() => {
          setIsOpen(false);
        }}
      >
      </IGRPAlertDialog>

    </div>
  );
}
