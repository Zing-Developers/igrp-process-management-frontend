import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { ExpandButton } from './expand-button';
import { NodeIcon } from './node-icon';
import { NodeContent } from './node-content';

interface TreeNodeProps {
  node: ProcessTreeNode;
  isExpanded: boolean;
  expandedNodes: Set<string>; // Add this to check child expansion
  onToggle: (nodeId: string) => void | Promise<void>; // Accept both sync and async
  onStartProcess: (processDefinitionId: string, processKey?: string, businessKey?: string, variables?: Record<string, any>) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
  level?: number;
}

export function TreeNode({
  node, 
  isExpanded, 
  expandedNodes,
  onToggle, 
  onStartProcess, 
  onViewDetails, 
  level = 0 
}: TreeNodeProps) {
  console.log('TreeNode node', node)
  const hasChildren = (node.children && node.children.length > 0);
  const paddingLeft = level * 24;

  const handleToggle = async () => {
    if (hasChildren) {
      const result = onToggle(node.id);
      // Handle both sync and async toggle functions
      if (result instanceof Promise) {
        await result;
      }
    }
  };

  return (
    <div key={node.id}>
      <div 
        className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onClick={handleToggle}
      > 
        
        <ExpandButton 
          hasChildren={Boolean(hasChildren)}
          isExpanded={isExpanded}
          onToggle={handleToggle}
        />

        <div className="mr-3">
          <NodeIcon node={node} isExpanded={isExpanded} />
        </div>

        <NodeContent 
          node={node}
          onStartProcess={onStartProcess}
          onViewDetails={onViewDetails}
        />
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              isExpanded={expandedNodes.has(child.id)}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onStartProcess={onStartProcess}
              onViewDetails={onViewDetails}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}