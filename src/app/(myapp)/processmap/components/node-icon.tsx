import React from 'react';
import { ProcessTreeNode } from '../types';
import { cn, IGRPIcon } from '@igrp/igrp-framework-react-design-system';

interface NodeIconProps {
  node: ProcessTreeNode;
  isExpanded: boolean;
}

export function NodeIcon({ node, isExpanded }: NodeIconProps) {
  switch (node.type) {
    case 'area':
      return (
        <IGRPIcon
          name={`icon1`}
          iconName={'Building'}
          size={18}
          className={cn(`text-primary`)}
        ></IGRPIcon>
      );
    case 'subarea':
      return isExpanded ? (
        <IGRPIcon
              name={`icon1`}
              iconName={'FolderOpen'}
              size={18}
              className={cn(`text-primary`)}
            ></IGRPIcon>
      ) : (
        <IGRPIcon
              name={`icon1`}
              iconName={'Folder'}
              size={18}
              className={cn(`text-primary`)}
            ></IGRPIcon>
      );
    case 'process':
      return (
        <IGRPIcon
          name={`icon1`}
          iconName={'FileText'}
          size={18}
          className={cn(`text-muted-foreground`)}

        ></IGRPIcon>
      );
    default:
      return null;
  }
}
