import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { TreeNode } from './tree-node';

interface ProcessTreeProps {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void | Promise<void>; // Accept both sync and async
  onStartProcess: (processDefinitionId: string, processKey?: string, businessKey?: string, variables?: Record<string, any>) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
  searchTerm: string;
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
      <div className="p-8 text-center text-gray-500">
        {searchTerm.trim() ? (
          <>
            <p>No processes found matching "{searchTerm}"</p>
            <p className="text-sm mt-1">Try adjusting your search terms</p>
          </>
        ) : (
          <>
            <p>No processes available</p>
            <p className="text-sm mt-1">Check back later or contact your administrator</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          isExpanded={expandedNodes.has(node.id)}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
          onStartProcess={onStartProcess}
          onViewDetails={onViewDetails}
          level={0}
        />
      ))}
    </div>
  );
}