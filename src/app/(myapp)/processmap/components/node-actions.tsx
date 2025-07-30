import React from 'react';
import {
  Eye,
  Play,
} from 'lucide-react';
import { ProcessTreeNode } from '../types';
import { Process, ProcessInstance } from '../../external/types/process';
import { IGRPButton } from '@igrp/igrp-framework-react-design-system';

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
      <IGRPButton
        onClick={handleViewDetails}
        title="Ver detalhes"
        iconName={"Eye"}
        size={"icon"}
        variant={"ghost"}
      >
      </IGRPButton>
      <IGRPButton
        onClick={handleStartProcess}
        title="Iniciar processo"
        iconName={"Play"}
        size={"icon"}
        iconClassName='text-green-600 hover:text-green-800'
        variant={"ghost"}
      >
      </IGRPButton>
    </div>
  );
}