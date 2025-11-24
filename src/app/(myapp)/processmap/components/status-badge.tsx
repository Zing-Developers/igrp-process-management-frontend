import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process } from '@igrp/platform-process-management-types';

interface StatusBadgeProps {
  node: ProcessTreeNode;
}

export function StatusBadge({ node }: StatusBadgeProps) {
  if (node.type === 'process' && node.data) {
    const process = node.data as Process;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        process.status === 'ACTIVE' 
          ? 'bg-primary/10 text-primary' 
          : 'bg-muted text-muted-foreground'
      }`}>
        v{process.version || '1.0'}
      </span>
    );
  }
  
  if (node.type === 'area' || node.type === 'subarea') {
    const childCount = node.children?.length || 0;
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
        {childCount} {childCount === 1 ? 'item' : 'itens'}
      </span>
    );
  }
  
  return null;
}