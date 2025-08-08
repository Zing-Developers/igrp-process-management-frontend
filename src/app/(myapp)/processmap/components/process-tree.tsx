import React from 'react';
import { ProcessTreeNode } from '../types';
import { TreeNode } from './tree-node';
import { Process, ProcessInstance } from '../../external/types/process';
import { InfoCard } from '../../components/info-card';

interface ProcessTreeProps {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onStartProcess: (
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => Promise<ProcessInstance | null>;
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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="space-y-1">
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
            onStartProcess={onStartProcess}
            onViewDetails={onViewDetails}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}
