import React from 'react';
import { ProcessTreeNode } from '../types';
import { TreeNode } from './tree-node';
import { Process, ProcessInstance } from '../../external/types/process';

interface ProcessTreeProps {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onStartProcess: (processDefinitionId: string, processKey: string, applicationBase: string, businessKey?: string, variables?: Array<{ name: string; value: string }>) => Promise<ProcessInstance | null>;
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
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum processo encontrado</p>
      </div>
    );
  }

  return (
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
  );
}