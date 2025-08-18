import { useMemo } from 'react';
import { useProcessInstancesData } from './use-process-instances-data';
import { getProcessInstanceStatusVariant } from '../../utils/status-helpers';
import { ProcessInstanceTableRow } from '../types';

export function useProcessInstances() {
  const {
    processInstancesState,
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchProcessInstances,
  } = useProcessInstancesData();

  // Transform process instances to table format
  const tableData = useMemo((): ProcessInstanceTableRow[] => {
    return processInstancesState.processInstances.map((instance) => {
      // Calculate days since creation
      const createdDate = new Date(instance.startedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        processInfo: instance.processName || instance.procReleaseKey,
        createBy: instance.startedBy || 'Sistema',
        currentStep: instance.currentActivityName || 'N/A',
        daysWaiting: diffDays.toString(),
        status: instance.status,
        processInstanceId: instance.id,
        procReleaseKey: instance.procReleaseKey,
        startedBy: instance.startedBy,
        version: instance.version,
      };
    });
  }, [processInstancesState.processInstances]);

  const handleSearch = (searchTerm: string) => {
    updateFilters({ processType: searchTerm });
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    fetchProcessInstances(page, processInstancesState.pageSize);
  };

  return {
    // Data
    tableData,
    loading: processInstancesState.loading,
    error: processInstancesState.error,
    totalElements: processInstancesState.totalElements,
    totalPages: processInstancesState.totalPages,
    currentPage: processInstancesState.currentPage,

    // Filter values
    filters,

    // Actions
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant: getProcessInstanceStatusVariant,
    fetchProcessInstances,
  };
}