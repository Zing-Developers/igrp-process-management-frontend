import React from "react";
import { NodeIcon } from "../node-icon";
import { AreaContent } from "./area-content";
import { ExpandButton } from "./expand-button";
import { Process } from "@igrp/platform-process-management-types";
import { ExtendedArea } from "../../types";

interface TreeNodeProps {
  node: ExtendedArea;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  searchTerm?: string;
  onEdit: (node: ExtendedArea | Process, parentAreaId?: string) => void;
  onDelete: (nodeId: string) => void;
  onAddSubarea: (nodeId: string) => void;
  onRemoveProcess: (nodeId: string, processId: string) => void;
}

export function TreeNode({
  node,
  expandedNodes,
  onToggle,
  searchTerm,
  onEdit,
  onDelete,
  onAddSubarea,
  onRemoveProcess,
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (hasChildren || node.type === "area") {
      onToggle(node.id);
    }
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center space-x-2 p-3 hover:bg-muted rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${node.level ?? 0 * 20 + 8}px` }}
        onClick={handleToggle}
      >
        <ExpandButton
          isExpanded={isExpanded}
          hasChildren={hasChildren || node.type === "area"}
          onToggle={handleToggle}
        />

        <NodeIcon node={node} isExpanded={isExpanded} />

        <AreaContent
          node={node}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubarea={onAddSubarea}
          onRemoveProcess={onRemoveProcess}
        />
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              searchTerm={searchTerm}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubarea={onAddSubarea}
              onRemoveProcess={onRemoveProcess}
            />
          ))}
        </div>
      )}
    </div>
  );
}
