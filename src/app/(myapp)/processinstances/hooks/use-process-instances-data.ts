import { useState, useEffect } from 'react';
import { getProcessInstances } from '../../external/client/services/process-instances.service';
import { useFilterData } from '../../components/processtaksfilter/hooks/use-filter-data';
import { ProcessInstancesFilters, ProcessInstancesState } from '../types';

export function useProcessInstancesData() {
  const [processInstancesState, setProcessInstancesState] = useState<ProcessInstancesState>({
    processInstances: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 1000,
  });

  // Use the shared filter data hook
  const { filters, dropdownOptions, updateFilters, resetFilters } = useFilterData();

  // Add process instance-specific status options to the shared dropdown options
  const enhancedDropdownOptions = {
    ...dropdownOptions,
    statuses: [
      { label: 'Ativo', value: 'ACTIVE' },
      { label: 'Pendente', value: 'PENDING' },
      { label: 'Concluído', value: 'COMPLETED' },
      { label: 'Cancelado', value: 'CANCELLED' },
    ],
  };

  // Fetch process instances function
  const fetchProcessInstances = async (
    page = 0,
    size = 1000,
    customFilters?: Partial<ProcessInstancesFilters>,
  ) => {
    setProcessInstancesState((prev) => ({ ...prev, loading: true, error: null }));

    // Use custom filters if provided, otherwise use current filters state
    const filtersToUse = customFilters ? { ...filters, ...customFilters } : filters;
    console.log('Fetching process instances with filters:', filtersToUse);

    try {
      // Map the filter fields to match the ProcessInstanceFilters interface
      const mappedFilters = {
        procReleaseKey: filtersToUse.processType || undefined,
        number: filtersToUse.processNumber || '',
        status: filtersToUse.status as
          | 'CREATED'
          | 'COMPLETED'
          | 'SUSPENDED'
          | 'TERMINATED'
          | 'RUNNING'
          | undefined,
        // Note: dateFrom and dateTo are not supported by the current ProcessInstanceFilters interface
        // You may need to extend the interface or handle these differently
      };

      // Call the service with separate parameters: page, size, filters
      const response = await getProcessInstances(page, size, mappedFilters);
      console.log('response:', response);

      setProcessInstancesState({
        processInstances: response.content,
        loading: false,
        error: null,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
      });
    } catch (error) {
      console.error('Error fetching process instances:', error);
      setProcessInstancesState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch process instances',
      }));
    }
  };

  // Apply filters and fetch process instances
  const applyFilters = (customFilters?: Partial<ProcessInstancesFilters>) => {
    // Use a callback to get the most current filter values
    const filtersToApply = customFilters || filters;
    console.log('Applying filters:', filtersToApply);

    // Update filters if custom filters provided
    if (customFilters) {
      updateFilters(customFilters);
    }

    // Fetch process instances with the filter values
    fetchProcessInstances(0, processInstancesState.pageSize, filtersToApply);
  };

  // Initial load
  useEffect(() => {
    fetchProcessInstances();
  }, []);

  return {
    processInstancesState,
    filters,
    dropdownOptions: enhancedDropdownOptions,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchProcessInstances,
  };
}
