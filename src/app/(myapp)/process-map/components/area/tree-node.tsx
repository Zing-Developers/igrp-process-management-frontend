import React from "react";
import { NodeIcon } from "../node-icon";
import { AreaContent } from "./area-content";
import { ExpandButton } from "./expand-button";
import { Process } from "@igrp/platform-process-management-types";
import { ExtendedArea } from "../../types";

interface TreeNodeProps {
  node: ExtendedArea;
  expandedNodes: Set<string>;
  onToggle: (node: ExtendedArea) => void;
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
  const { level = 0, id, type, color, subareas, children } = node;
  const isExpanded = expandedNodes.has(id);
  const hasChildren = subareas && subareas.length > 0;

  if (type === "process") return null;

  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer group"
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onToggle(node)}
      >
        <ExpandButton
          isExpanded={isExpanded}
          hasChildren={hasChildren || type === "area"}
          onToggle={() => onToggle(node)}
        />

        {color && (
          <div className="h-4 w-5 rounded" style={{ backgroundColor: color }} />
        )}

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
          {children?.map((child) => (
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
