import React from 'react';
import {
  Eye,
  Play,
} from 'lucide-react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';

interface NodeActionsProps {
  node: ProcessTreeNode;
  onStartProcess: (processDefinitionId: string, processKey?: string, businessKey?: string, variables?: Record<string, any>) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
}

export function NodeActions({ node, onStartProcess, onViewDetails }: NodeActionsProps) {
  if (node.type !== 'process') {
    return null;
  }

  const handleStartProcess = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.data) {
      const process = node.data as Process;
      await onStartProcess(process.id, process.processKey);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.data) {
      onViewDetails(node.data as Process);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleViewDetails}
        className="p-1 text-gray-400 hover:text-gray-600 rounded"
        title="Ver detalhes"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={handleStartProcess}
        className="p-1 text-green-600 hover:text-green-800 rounded disabled:opacity-50"
        title="Iniciar processo"
      >
        <Play className="w-4 h-4" />
      </button>
    </div>
  );
}