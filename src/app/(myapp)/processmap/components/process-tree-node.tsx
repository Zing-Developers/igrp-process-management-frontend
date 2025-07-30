import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { ProcessTree } from './process-tree';

export function ProcessTreeComponent({
  nodes,
  expandedNodes,
  onToggle,
  onStartProcess,
  onViewDetails,
  searchTerm,
}: {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void | Promise<void>; // Accept both sync and async
  onStartProcess: (
    processDefinitionId: string,
    processKey?: string,
    businessKey?: string,
    variables?: Record<string, any>,
  ) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
  searchTerm: string;
}) {
  return (
    <div
      className={`border border-gray-200 rounded-lg bg-white shadow-sm`}
    >
      <div className="p-4">
        <ProcessTree
          nodes={nodes}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
          onStartProcess={onStartProcess}
          onViewDetails={onViewDetails}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

// Export individual components for direct use
export { TreeNode } from './tree-node';
export { ProcessTree } from './process-tree';
export { NodeIcon } from './node-icon';
export { StatusBadge } from './status-badge';
export { NodeActions } from './node-actions';
export { NodeContent } from './node-content';
export { ExpandButton } from './expand-button';
