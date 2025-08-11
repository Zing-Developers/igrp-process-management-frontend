import { useMemo } from 'react';
import { useProcessInstancesData } from './use-process-instances-data';
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
  
  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'Criado';
      case 'RUNNING':
        return 'Em execução';
      case 'SUSPENDED':
        return 'Suspenso';
      case 'CANCELLED':
        return 'Cancelado';
      case 'COMPLETED':
        return 'Concluído';
      case 'TERMINATED':
        return 'Terminado';
      default:
        return status;
    }
  };

  // Transform process instances to table format
  const tableData = useMemo((): ProcessInstanceTableRow[] => {
    return processInstancesState.processInstances.map(processInstance => {
      // Calculate days waiting
      const startedDate = new Date(processInstance.startedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - startedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        processInfo: processInstance.procReleaseKey || 'N/A',
        createBy: processInstance.startedBy || 'Sistema',
        currentStep: 'N/A',
        daysWaiting: diffDays.toString(),
        status: getStatusLabel(processInstance.status),
        processInstanceId: processInstance.id,
        procReleaseKey: processInstance.procReleaseKey,
        startedAt: processInstance.startedAt,
        startedBy: processInstance.startedBy,
        version:  processInstance.version
      };
    });
  }, [processInstancesState.processInstances]);


  // Helper function to get status variant for badge
  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'info';
      case 'RUNNING':
        return 'warning';
      case 'SUSPENDED':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      case 'COMPLETED':
        return 'success';
      case 'TERMINATED':
        return 'destructive';
      default:
        return 'default';
    }
  };

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
    getStatusVariant,
    fetchProcessInstances,
  };
}