import { useMemo } from 'react';
import { useAvailableTasksData } from './use-available-tasks-data';
import { TaskTableRow } from '../types';

export function useAvailableTasks() {
  const {
    tasksState,
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchTasks,
  } = useAvailableTasksData();

  // Transform tasks to table format
  const tableData = useMemo((): TaskTableRow[] => {
    return tasksState.tasks.map(task => {
      // Calculate days waiting
      const createdDate = new Date(task.createdDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        processInfo: task.processName || 'N/A',
        createBy: task.assignee || 'Sistema',
        taskName: task.name,
        status: getStatusLabel(task.status),
        daysWaiting: diffDays.toString(),
        taskId: task.id,
        processInstanceId: task.processInstanceId,
        createdDate: task.createdDate,
        assignee: task.assignee,
      };
    });
  }, [tasksState.tasks]);

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'Criado';
      case 'ASSIGNED':
        return 'Atribuído';
      case 'COMPLETED':
        return 'Concluído';
      default:
        return status;
    }
  };

  // Helper function to get status variant for badge
  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'info';
      case 'ASSIGNED':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleSearch = (searchTerm: string) => {
    // You can implement search logic here
    // For now, we'll use it as a general filter
    updateFilters({ processKey: searchTerm });
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    fetchTasks(page, tasksState.pageSize);
  };

  return {
    // Data
    tableData,
    loading: tasksState.loading,
    error: tasksState.error,
    totalElements: tasksState.totalElements,
    totalPages: tasksState.totalPages,
    currentPage: tasksState.currentPage,
    
    // Filter values
    filters,
    
    // Actions
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant,
    fetchTasks,
  };
}