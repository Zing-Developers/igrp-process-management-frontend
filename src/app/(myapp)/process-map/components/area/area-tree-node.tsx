import React from "react";
import { AreaTree } from "./area-tree";
import { Process } from "@igrp/platform-process-management-types";
import { ExtendedArea } from "../../types";

function AreaTreeNodeComponent({
  nodes,
  expandedNodes,
  searchTerm,
  onToggle,
  onEdit,
  onDelete,
  onAddSubarea,
  onRemoveProcess,
}: {
  nodes: ExtendedArea[];
  expandedNodes: Set<string>;
  searchTerm?: string;
  onToggle: (nodeId: string) => void;
  onEdit: (node: ExtendedArea | Process, parentAreaId?: string) => void;
  onDelete: (nodeId: string) => void;
  onAddSubarea: (nodeId: string) => void;
  onRemoveProcess: (nodeId: string, processId: string) => void;
}) {
  return (
    <AreaTree
      nodes={nodes}
      expandedNodes={expandedNodes}
      onToggle={onToggle}
      searchTerm={searchTerm}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddSubarea={onAddSubarea}
      onRemoveProcess={onRemoveProcess}
    />
  );
}

export { AreaTreeNodeComponent };
