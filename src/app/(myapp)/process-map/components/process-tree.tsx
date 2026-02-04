import React from "react";
import { ProcessTreeNode } from "../types";
import { TreeNode } from "./tree-node";
import { InfoCard } from "../../components/info-card";
import {
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
} from "@igrp/igrp-framework-react-design-system";
import { cn } from "@/lib/utils";
import { Process } from "@igrp/platform-process-management-types";

interface ProcessTreeProps {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
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
  searchTerm?: string;
}

export function ProcessTree({
  nodes,
  expandedNodes,
  onToggle,
  onStartProcess,
  onViewDetails,
  searchTerm,
}: ProcessTreeProps) {
  if (nodes.length === 0) {
    return (
      <InfoCard
        iconName="FileText"
        title="Nenhum processo encontrado"
        description="Nenhum processo foi configurado em áreas."
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
            onStartProcess={onStartProcess}
            onViewDetails={onViewDetails}
            searchTerm={searchTerm}
          />
        </div>
      ))}
    </div>
  );
}
