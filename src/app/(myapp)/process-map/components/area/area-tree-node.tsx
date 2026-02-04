import React from "react";
import { ProcessTreeNode } from "../../types";
import { AreaTree } from "./area-tree";

function AreaTreeNodeComponent({
  nodes,
  expandedNodes,
  searchTerm,
  onToggle
}: {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  searchTerm?: string;
  onToggle: (nodeId: string) => void;
}) {
  return (
    <AreaTree
      nodes={nodes}
      expandedNodes={expandedNodes}
      onToggle={onToggle}
      searchTerm={searchTerm}
    />
  );
}


export { AreaTreeNodeComponent };