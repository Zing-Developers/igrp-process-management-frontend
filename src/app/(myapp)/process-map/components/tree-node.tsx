import React from "react";
import { ExtendedArea } from "../types";
import { NodeIcon } from "./node-icon";
import { NodeContent } from "./node-content";
import { ExpandButton } from "./expand-button";
import { Process } from "@igrp/platform-process-management-types";

interface TreeNodeProps {
  node: ExtendedArea;
  expandedNodes: Set<string>;
  onToggle: (node: ExtendedArea) => void;
  onStartProcess: (
    process: Process,
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => void;
  searchTerm?: string;
}

export function TreeNode({
  node,
  expandedNodes,
  onToggle,
  onStartProcess,
  searchTerm,
}: TreeNodeProps) {
  const { color, id, type, level = 0, children } = node;

  const isExpanded = expandedNodes.has(id);
  const hasChildren = children && children.length > 0;

  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer group/process"
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

        <NodeContent node={node} onStartProcess={onStartProcess} />
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4">
          {children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onStartProcess={onStartProcess}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}
