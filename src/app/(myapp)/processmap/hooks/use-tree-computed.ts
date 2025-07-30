import { useMemo } from 'react';
import { ProcessTreeNode } from '../types';
import { buildProcessTree, flattenTreeNodes } from '../utils/tree-utils';
import { ExtendedArea } from '../../processconfiguration/types';

export function useTreeComputed(
  areas: ExtendedArea[], 
  expandedNodes: Set<string>
) {
  const treeNodes = useMemo(() => {
    return buildProcessTree(areas);
  }, [areas]);

  const flatNodes = useMemo(() => {
    return flattenTreeNodes(treeNodes, expandedNodes);
  }, [treeNodes, expandedNodes]);

  const totalProcesses = useMemo(() => {
    const countProcesses = (nodes: ProcessTreeNode[]): number => {
      return nodes.reduce((count, node) => {
        if (node.type === 'process') {
          return count + 1;
        }
        if (node.children) {
          return count + countProcesses(node.children);
        }
        return count;
      }, 0);
    };
    return countProcesses(treeNodes);
  }, [treeNodes]);

  const totalAreas = useMemo(() => {
    const countAreas = (nodes: ProcessTreeNode[]): number => {
      return nodes.reduce((count, node) => {
        if (node.type === 'area' || node.type === 'subarea') {
          return count + 1;
        }
        if (node.children) {
          return count + countAreas(node.children);
        }
        return count;
      }, 0);
    };
    return countAreas(treeNodes);
  }, [treeNodes]);

  return {
    treeNodes,
    flatNodes,
    totalProcesses,
    totalAreas,
  };
}