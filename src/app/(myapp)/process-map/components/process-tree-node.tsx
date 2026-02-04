import React from "react";
import { ProcessTreeNode } from "../types";
import { ProcessTree } from "./process-tree";
import { Process } from "@igrp/platform-process-management-types";

export function ProcessTreeComponent({
  nodes,
  expandedNodes,
  searchTerm,
  onToggle,
  onStartProcess,
  onViewDetails,
}: {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  searchTerm?: string;
  onToggle: (nodeId: string) => void;
  onStartProcess: (
    process: Process,
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => void;
  onViewDetails: (process: Process) => void;
}) {
  return (
    <ProcessTree
      nodes={nodes}
      expandedNodes={expandedNodes}
      onToggle={onToggle}
      onStartProcess={onStartProcess}
      onViewDetails={onViewDetails}
      searchTerm={searchTerm}
    />
  );
}
