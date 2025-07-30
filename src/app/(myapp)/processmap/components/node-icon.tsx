import React from 'react';
import {
  Building,
  FolderOpen,
  Folder,
  FileText,
} from 'lucide-react';
import { ProcessTreeNode } from '../types';

interface NodeIconProps {
  node: ProcessTreeNode;
  isExpanded: boolean;
} 

export function NodeIcon({ node, isExpanded }: NodeIconProps) {
  switch (node.type) {
    case 'area':
      return <Building className="w-4 h-4 text-blue-600" />;
    case 'subarea':
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-blue-500" />
      ) : (
        <Folder className="w-4 h-4 text-blue-500" />
      );
    case 'process':
      return <FileText className="w-4 h-4 text-purple-600" />;
    default:
      return null;
  }
}