import { useCallback, useState } from 'react';
import { getMyTasks } from '../../external/client/services/task.service';
import { MyTasksState, MyTasksFilters } from '../types';
import { useFilterData } from '../../components/processtaksfilter/hooks/use-filter-data';

export interface MyTasksTableRow {
  process: string;
  assignedBy: string;
  currentStep: string;
  waitingDays: string;
  status: string;
  taskId: string;
  taskKey: string;
  processInstanceId: string;
  processKey: string;
  createdDate?: string;
}

// Export unclaim modal state interface
export interface UnclaimModalState {
  isOpen: boolean;
  selectedTask: MyTasksTableRow | null;
}

export function useMyTasksData() {
  const [myTasksState, setMyTasksState] = useState<MyTasksState>({
    tasks: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10000,
  });

  // Add unclaim modal state
  const [unclaimModalState, setUnclaimModalState] = useState<UnclaimModalState>({
    isOpen: false,
    selectedTask: null,
  });

  const { filters, updateFilters, resetFilters } = useFilterData();

  // Fetch my tasks function
  const fetchMyTasks = async (
    page: number,
    size: number,
    customFilters?: Partial<MyTasksFilters>,
  ) => {
    setMyTasksState((prev) => ({ ...prev, loading: true, error: null }));

    // Use custom filters if provided, otherwise use current filters state
    const filtersToUse = customFilters ? { ...filters, ...customFilters } : filters;
    console.log('Fetching my tasks with filters:', filtersToUse);

    try {
      // Map filter fields to match the service interface
      const mappedFilters = {
        processNumber: filtersToUse.processNumber || '',
        processKey: filtersToUse.processType || '', // processType maps to processKey
        user: filtersToUse.user || '',
        status: filtersToUse.status || '',
        dateFrom: filtersToUse.dateFrom || '',
        dateTo: filtersToUse.dateTo || '',
        page,
        size,
      };

      const response = await getMyTasks(mappedFilters);

      setMyTasksState((prev) => ({
        ...prev,
        tasks: response.content,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      setMyTasksState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch my tasks',
      }));
    }
  };

  // Apply current filters
  const applyFilters = () => {
    fetchMyTasks(0, myTasksState.pageSize);
  };

  // Reset filters and fetch data
  const handleResetFilters = () => {
    resetFilters();
    fetchMyTasks(0, myTasksState.pageSize, {
      processNumber: '',
      processKey: '',
      user: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  // Add unclaim modal handlers

  const handleOpenUnclaimModal = useCallback((task: MyTasksTableRow) => {
    console.log('Opening unclaim modal for task:', task);
    setUnclaimModalState({
      isOpen: true,
      selectedTask: task,
    });
  }, []);

  const handleCloseUnclaimModal = () => {
    setUnclaimModalState({
      isOpen: false,
      selectedTask: null,
    });
  };

  return {
    myTasksState,
    unclaimModalState,
    filters,
    updateFilters,
    fetchMyTasks,
    applyFilters,
    resetFilters: handleResetFilters,
    handleOpenUnclaimModal,
    handleCloseUnclaimModal,
  };
}
