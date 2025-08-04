import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { NodeActions } from './node-actions';

interface NodeContentProps {
  node: ProcessTreeNode;
  onStartProcess: (
    processDefinitionId: string, 
    processKey: string, 
    applicationBase: string, 
    businessKey?: string, 
    variables?: Array<{ name: string; value: string }>
  ) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
}

export function NodeContent({ node, onStartProcess, onViewDetails }: NodeContentProps) {
  const isProcess = node.type === 'process';

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {node.name}
          </div>
          {isProcess && (
            <div className="text-xs text-gray-500 truncate">
              {(node.data as Process).description}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        {isProcess && (
          <div className="text-xs text-gray-400">
            v{(node.data as Process).version}
          </div>
        )}
        <NodeActions node={node} onStartProcess={onStartProcess} onViewDetails={onViewDetails} />
      </div>
    </div>
  );
}
