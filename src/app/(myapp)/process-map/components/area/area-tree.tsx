import React from "react";
import { TreeNode } from "./tree-node";
import { InfoCard } from "../../../components/info-card";
import { Process } from "@igrp/platform-process-management-types";
import { ExtendedArea } from "../../types";

interface ProcessTreeProps {
  nodes: ExtendedArea[];
  expandedNodes: Set<string>;
  searchTerm?: string;
  onToggle: (nodeId: string) => void;
  onEdit: (node: ExtendedArea | Process, parentAreaId?: string) => void;
  onDelete: (nodeId: string) => void;
  onAddSubarea: (nodeId: string) => void;
  onRemoveProcess: (nodeId: string, processId: string) => void;
}

export function AreaTree({
  nodes = [],
  expandedNodes,
  onToggle,
  searchTerm,
  onEdit,
  onDelete,
  onAddSubarea,
  onRemoveProcess,
}: ProcessTreeProps) {
  if (nodes.length === 0) {
    return (
      <InfoCard
        iconName="FileText"
        title="Nenhuma área encontrada"
        description="Nenhuma área foi configurada."
      />
    );
  }

  return (
    <div className="space-y-3">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="border rounded-lg space-y-3 p-1 gap-3 pb-2"
        >
          <TreeNode
            key={node.id}
            node={node}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
            searchTerm={searchTerm}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubarea={onAddSubarea}
            onRemoveProcess={onRemoveProcess}
          />
        </div>
      ))}
    </div>
  );
}
