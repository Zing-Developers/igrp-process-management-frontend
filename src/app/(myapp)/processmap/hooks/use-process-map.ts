import { useCallback } from 'react';
import { ProcessMapHookReturn } from '../types';
import { useProcessMapData } from './use-process-map-data';
import { useTreeExpansion } from './use-tree-expansion';
import { useProcessOperations } from './use-process-operations';
import { useProcessModal } from './use-process-modal';
import { usePriorityModal } from './use-priority-modal';
import { useTreeSearch } from './use-tree-search';
import { useTreeComputed } from './use-tree-computed';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Process } from '@igrp/platform-process-management-types';

export function useProcessMap(igrpToast?: any, router?: AppRouterInstance): ProcessMapHookReturn {
  // Data management
  const { areas, loadedNodes, loading, error, loadSubareas, refreshData } = useProcessMapData();

  // Tree expansion state
  const { expandedNodes, toggleNode: originalToggleNode } = useTreeExpansion();

  // Process operations (now with priority workflow)
  const { selectedProcess, selectProcess, prepareProcessStart, startProcessWithPriority } =
    useProcessOperations(igrpToast, router);

  // Modal management
  const { detailModal } = useProcessModal();
  const { priorityModal } = usePriorityModal();

  // Computed tree values
  const { treeNodes, flatNodes, totalProcesses, totalAreas } = useTreeComputed(
    areas,
    expandedNodes,
  );

  // Search functionality
  const { searchTerm, setSearchTerm, filteredNodes, clearSearch } = useTreeSearch(treeNodes);

  // Enhanced toggle node that also loads subareas when expanding
  const toggleNode = useCallback(
    async (nodeId: string) => {
      const isCurrentlyExpanded = expandedNodes.has(nodeId);

      // Toggle the expansion state
      originalToggleNode(nodeId);

      // If we're expanding (not collapsing) and haven't loaded subareas yet, load them
      if (!isCurrentlyExpanded && !loadedNodes.has(nodeId)) {
        try {
          await loadSubareas(nodeId);
        } catch (error) {
          console.error('Failed to load subareas:', error);
          if (igrpToast) {
            igrpToast({
              type: 'error',
              title: 'Erro',
              description: 'Erro ao carregar subáreas. Tente novamente.',
            });
          }
        }
      }
    },
    [expandedNodes, originalToggleNode, loadedNodes, loadSubareas, igrpToast],
  );

  // New startProcess function that opens priority modal first
  const startProcess = useCallback(
    (
      process: Process,
      processDefinitionId: string,
      processKey: string,
      applicationBase: string,
      businessKey?: string,
      variables?: Array<{ name: string; value: string }>,
    ) => {
      // Prepare the process start parameters
      prepareProcessStart(processDefinitionId, processKey, applicationBase, businessKey, variables);

      // Open priority modal
      priorityModal.open(process);
    },
    [prepareProcessStart, priorityModal],
  );

  // Handle priority modal save
  const handlePrioritySave = useCallback(
    async (data: { priority: string }) => {
      const priority = parseInt(data.priority, 10);
      if (!isNaN(priority)) {
        await startProcessWithPriority(priority);
        priorityModal.close();
      } else {
        if (igrpToast) {
          igrpToast({
            type: 'error',
            title: 'Erro',
            description: 'Por favor, selecione uma prioridade válida.',
          });
        }
      }
    },
    [startProcessWithPriority, priorityModal, igrpToast],
  );

  return {
    // State
    areas,
    expandedNodes,
    loadedNodes,
    selectedProcess,
    loading,
    error,

    // Computed values
    treeNodes,
    flatNodes,
    filteredNodes,
    totalProcesses,
    totalAreas,

    // Search
    searchTerm,
    setSearchTerm,
    clearSearch,

    // Actions
    toggleNode,
    loadSubareas,
    selectProcess,
    startProcess, // Updated to use priority workflow
    refreshData,

    // Modals
    detailModal,
    priorityModal: {
      ...priorityModal,
      onSave: handlePrioritySave,
    },
  };
}
