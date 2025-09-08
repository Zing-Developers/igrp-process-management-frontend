import React from 'react';
import { ProcessTreeNode } from '../types';
import { TreeNode } from './tree-node';
import { InfoCard } from '../../components/info-card';
import { IGRPCard, IGRPCardContent } from '@igrp/igrp-framework-react-design-system';
import { cn } from '@/lib/utils';
import { Process } from '@igrp/platform-process-management-types';

interface ProcessTreeProps {
  nodes: ProcessTreeNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onStartProcess: (
    process: Process,
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => void;
  onViewDetails: (process: Process) => void;
  searchTerm?: string;
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
      <InfoCard
        iconName="FileText"
        title="Nenhum processo encontrado"
        description="Nenhum processo foi configurado em áreas."
      />
    );
  }

  return (
     <IGRPCard name={`card1`} className={cn('w-full ')}>
      <IGRPCardContent className={cn('px-3 py-3')}>
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
            onStartProcess={onStartProcess}
            onViewDetails={onViewDetails}
            searchTerm={searchTerm}
          />
        ))}
      </IGRPCardContent>
    </IGRPCard>
  );
}
