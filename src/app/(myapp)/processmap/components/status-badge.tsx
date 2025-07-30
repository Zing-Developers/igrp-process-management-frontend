import React from 'react';
import { ProcessTreeNode } from '../types';
import { Process } from '../../external/types/process';

interface StatusBadgeProps {
  node: ProcessTreeNode;
}

export function StatusBadge({ node }: StatusBadgeProps) {
  if (node.type === 'process' && node.data) {
    const process = node.data as Process;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        process.status === 'ACTIVE' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        v{process.version || '1.0'}
      </span>
    );
  }
  
  if (node.type === 'area' || node.type === 'subarea') {
    const childCount = node.children?.length || 0;
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {childCount} {childCount === 1 ? 'item' : 'itens'}
      </span>
    );
  }
  
  return null;
}