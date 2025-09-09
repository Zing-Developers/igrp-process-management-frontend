import { useMemo } from 'react';
import { useProcessInstancesData } from './use-process-instances-data';
import { getProcessInstanceStatusVariant } from '../../utils/status-helpers';
import { ProcessInstanceTableRow } from '../types';
import { getDateTemplate, getProcessInfo, getProgressTemplate, getUserInfo } from '../../utils/columns-template';

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
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error Allow JSX in table row fields without refactor
    return processInstancesState.processInstances.map((instance) => {
      // Calculate days since creation
      const createdDate = new Date(instance.startedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        processInfo: getProcessInfo(instance.name, instance.number),
        createBy: getUserInfo(instance.startedBy),
        daysWaiting: diffDays.toString(),
        version: instance.version,
        startedAt: getDateTemplate(instance.startedAt),
        endedAt: getDateTemplate(instance.endedAt),
        progress: getProgressTemplate(instance.progress),
        priority: instance.priority + '',
        status: instance.status,
        processInstanceId: instance.id,
        procReleaseKey: instance.procReleaseKey,
        startedBy: instance.startedBy,
        statusDesc: instance.statusDesc,
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
