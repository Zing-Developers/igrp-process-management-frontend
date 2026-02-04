import React from "react";
import { ProcessTreeNode } from "../../types";
import { TreeNode } from "./tree-node";
import { InfoCard } from "../../../components/info-card";

interface ProcessTreeProps {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  searchTerm?: string;
}

export function AreaTree({
  nodes = [],
  expandedNodes,
  onToggle,
  searchTerm,
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
          />
        </div>
      ))}
    </div>
  );
}
