import React from 'react';
import { ProcessTreeNode } from '../types';
import { ProcessTree } from './process-tree';
import { Process, ProcessInstance } from '@igrp/platform-process-management-types';

export function ProcessTreeComponent({
  nodes,
  expandedNodes,
  searchTerm,
  onToggle,
  onStartProcess,
  onViewDetails,
}: {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  searchTerm?: string;
  onToggle: (nodeId: string) => void;
  onStartProcess: (
    processDefinitionId: string,
    processKey: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => Promise<ProcessInstance | null>;
  onViewDetails: (process: Process) => void;
}) {
  return (
    <ProcessTree
      nodes={nodes}
      expandedNodes={expandedNodes}
      onToggle={onToggle}
      onStartProcess={onStartProcess}
      onViewDetails={onViewDetails}
      searchTerm={searchTerm}
    />
  );
}
