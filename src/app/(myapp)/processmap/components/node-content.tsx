import React from 'react';
import { ProcessTreeNode } from '../types';
import { NodeActions } from './node-actions';
import { Area, Process, ProcessInstance } from '@igrp/platform-process-management-types';

interface NodeContentProps {
  node: ProcessTreeNode;
  onStartProcess: (
    processDefinitionId: string,
    processKey: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
}

export function NodeContent({ node, onStartProcess, onViewDetails }: NodeContentProps) {
  const isProcess = node.type === 'process';
  const isAreaOrSubarea = node.type === 'area' || node.type === 'subarea';

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{node?.name || 'N/A'}</div>
          {isProcess && (
            <>
              <div className="text-xs text-gray-500 truncate">
                {(node.data as Process).description}
              </div>
              <div className="text-xs text-gray-400">
                v{(node.data as Process).version} - {(node.data as Process).processKey}
              </div>
            </>
          )}
          {isAreaOrSubarea && (
            <>
              <div className="text-xs text-gray-500 truncate">
                {(node.data as Area).description}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <NodeActions node={node} onStartProcess={onStartProcess} onViewDetails={onViewDetails} />
      </div>
    </div>
  );
}
