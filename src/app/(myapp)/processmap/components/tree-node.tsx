import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { NodeIcon } from './node-icon';
import { NodeContent } from './node-content';
import { ExpandButton } from './expand-button';

interface TreeNodeProps {
  node: ProcessTreeNode;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onStartProcess: (processDefinitionId: string, processKey: string, applicationBase: string, businessKey?: string, variables?: Array<{ name: string; value: string }>) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
  searchTerm?: string;
}

export function TreeNode({
  node,
  expandedNodes,
  onToggle,
  onStartProcess,
  onViewDetails,
  searchTerm,
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (hasChildren || node.type === 'area') {
      onToggle(node.id);
    }
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${node.level * 20 + 8}px` }}
        onClick={handleToggle}
      >
        <ExpandButton
          isExpanded={isExpanded}
          hasChildren={hasChildren || node.type === 'area'}
          onToggle={handleToggle}
        />
        
        <NodeIcon node={node} isExpanded={isExpanded} />
        
        <NodeContent
          node={node}
          onStartProcess={onStartProcess}
          onViewDetails={onViewDetails}
        />
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onStartProcess={onStartProcess}
              onViewDetails={onViewDetails}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}