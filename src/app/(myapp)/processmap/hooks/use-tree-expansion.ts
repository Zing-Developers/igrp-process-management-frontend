import { useState, useCallback } from 'react';

export function useTreeExpansion() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => new Set(prev).add(nodeId));
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  const expandAll = useCallback((nodeIds: string[]) => {
    setExpandedNodes(new Set(nodeIds));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  return {
    expandedNodes,
    toggleNode,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
  };
}