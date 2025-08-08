import { useState } from 'react';
import { getMyTasks } from '../../external/client/services/task.service';
import { MyTasksState, MyTasksFilters } from '../types';
import { useFilterData } from '../../components/processtaksfilter/hooks/use-filter-data';

export function useMyTasksData() {
  const [myTasksState, setMyTasksState] = useState<MyTasksState>({
    tasks: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  const { filters, updateFilters, resetFilters } = useFilterData();

  // Fetch my tasks function
  const fetchMyTasks = async (page = 0, size = 10, customFilters?: Partial<MyTasksFilters>) => {
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

  return {
    myTasksState,
    filters,
    updateFilters,
    fetchMyTasks,
    applyFilters,
    resetFilters: handleResetFilters,
  };
}