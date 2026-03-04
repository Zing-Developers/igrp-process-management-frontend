import React from "react";
import { ExtendedArea } from "../../types";
import { Area, Process } from "@igrp/platform-process-management-types";
import { AreaActions } from "./area-actions";

interface NodeContentProps {
  node: ExtendedArea;
  onEdit: (node: ExtendedArea | Process, parentAreaId?: string) => void;
  onDelete: (nodeId: string) => void;
  onAddSubarea: (nodeId: string) => void;
  onRemoveProcess: (nodeId: string, processId: string) => void;
}

export function AreaContent({
  node,
  onEdit,
  onDelete,
  onAddSubarea,
  onRemoveProcess,
}: NodeContentProps) {
  const { type } = node;
  const isProcess = type === "process";
  const isAreaOrSubarea = type === "area" || type === "subarea";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {node?.name || "N/A"}
          </div>
          {isProcess && (
            <>
              <div className="text-xs text-gray-500 truncate">
                {(node.data as Process).description}
              </div>
              <div className="text-xs text-gray-400">
                v{(node.data as Process).version} -{" "}
                {(node.data as Process).processKey}
              </div>
            </>
          )}
          {isAreaOrSubarea && (
            <>
              <div className="text-xs text-gray-500 truncate">
                {(node.data as Area).description}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <AreaActions
          node={node}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubarea={onAddSubarea}
          onRemoveProcess={onRemoveProcess}
        />
      </div>
    </div>
  );
}
