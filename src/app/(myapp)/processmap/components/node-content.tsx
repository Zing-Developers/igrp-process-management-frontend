import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { Area } from '../../external/types/area';
import { StatusBadge } from './status-badge';
import { NodeActions } from './node-actions';

interface NodeContentProps {
  node: ProcessTreeNode;
  onStartProcess: (
    processDefinitionId: string,
    processKey?: string,
    businessKey?: string,
    variables?: Record<string, any>,
  ) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
}

export function NodeContent({ node, onStartProcess, onViewDetails }: NodeContentProps) {
  const getDescription = () => {
    if (node.data) {
      if (node.type === 'process') {
        const process = node.data as Process;
        return process.description;
      }
      if (node.type === 'area' || node.type === 'subarea') {
        const area = node.data as Area;
        return area.description;
      }
    }
    return null;
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{node.name}</h4>
          {getDescription() && <p className="text-xs text-gray-500 truncate">{getDescription()}</p>}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <StatusBadge node={node} />
          <NodeActions node={node} onStartProcess={onStartProcess} onViewDetails={onViewDetails} />
        </div>
      </div>
    </div>
  );
}
