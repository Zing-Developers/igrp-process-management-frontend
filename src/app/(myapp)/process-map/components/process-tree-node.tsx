import React from "react";
import { ExtendedArea } from "../types";
import { ProcessTree } from "./process-tree";
import { Process } from "@igrp/platform-process-management-types";

export function ProcessTreeComponent({
  nodes,
  expandedNodes,
  searchTerm,
  onToggle,
  onStartProcess,
}: {
  nodes: ExtendedArea[];
  expandedNodes: Set<string>;
  searchTerm?: string;
  onToggle: (node: ExtendedArea) => void;
  onStartProcess: (
    process: Process,
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => void;
}) {
  return (
    <ProcessTree
      nodes={nodes}
      expandedNodes={expandedNodes}
      onToggle={onToggle}
      onStartProcess={onStartProcess}
      searchTerm={searchTerm}
    />
  );
}
