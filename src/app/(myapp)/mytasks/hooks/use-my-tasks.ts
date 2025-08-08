import { useMemo } from 'react';
import { useMyTasksData } from './use-my-tasks-data';
import { TaskTableRow } from '../types';

export function useMyTasks() {
  const {
    myTasksState,
    filters,
    updateFilters,
    fetchMyTasks,
    applyFilters,
    resetFilters,
  } = useMyTasksData();

  // Transform tasks data for the table
  const tableData = useMemo((): TaskTableRow[] => {
    return myTasksState.tasks.map((task) => {
      // Calculate waiting days
      const createdDate = new Date(task.createdDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: task.id,
        process: task.processName || task.name,
        createBy: task.assignee || 'Sistema',
        currentStep: task.name,
        waitingDays: diffDays.toString(),
        status: task.status,
        taskInfo: task,
      };
    });
  }, [myTasksState.tasks]);

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    updateFilters({ processType: searchTerm });
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    fetchMyTasks(page, myTasksState.pageSize);
  };

  return {
    // Data
    tableData,
    myTasksState,
    filters,
    
    // Actions
    fetchMyTasks,
    applyFilters,
    resetFilters,
    handleSearch,
    handlePageChange,
    updateFilters,
    
    // State
    loading: myTasksState.loading,
    error: myTasksState.error,
    totalElements: myTasksState.totalElements,
    totalPages: myTasksState.totalPages,
    currentPage: myTasksState.currentPage,
    pageSize: myTasksState.pageSize,
  };
}