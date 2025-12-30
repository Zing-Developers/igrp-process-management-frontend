import { useState } from "react";
import { getProcessInstances } from "../../external/client/services/process-instances";
import { useFilterData } from "../../components/processtaksfilter/hooks/use-filter-data";
import { ProcessInstancesFilters, ProcessInstancesState } from "../types";
import { useQuery } from "@tanstack/react-query";

export function useProcessInstancesData() {
  // Use the shared filter data hook
  const { filters, dropdownOptions, updateFilters, resetFilters } =
    useFilterData();

  // Add process instance-specific status options to the shared dropdown options
  const enhancedDropdownOptions = {
    ...dropdownOptions,
    statuses: [
      { label: "Ativo", value: "ACTIVE" },
      { label: "Pendente", value: "PENDING" },
      { label: "Concluído", value: "COMPLETED" },
      { label: "Cancelado", value: "CANCELLED" },
    ],
  };

  // State for pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(1000);
  const [customFilters, setCustomFilters] = useState<Partial<ProcessInstancesFilters> | undefined>();

  // Use query at the top level - hooks must be called at the top level
  const { data, isLoading, error } = useQuery({
    queryKey: ["process-instances", page, size, filters, customFilters],
    queryFn: () => {
      const filtersToUse = customFilters
        ? { ...filters, ...customFilters }
        : filters;
      return getProcessInstances(page, size, filtersToUse);
    },
  });

  // Transform query result to state format
  const processInstancesState: ProcessInstancesState = {
    processInstances: data?.content || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? "Failed to fetch process instances" : null),
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.pageNumber || 0,
    pageSize: data?.pageSize || 1000,
  };

  // Fetch process instances function - now just updates state to trigger refetch
  const fetchProcessInstances = (
    newPage = 0,
    newSize = 1000,
    newCustomFilters?: Partial<ProcessInstancesFilters>
  ) => {
    setPage(newPage);
    setSize(newSize);
    setCustomFilters(newCustomFilters);
  };

  // Apply filters and fetch process instances
  const applyFilters = (newCustomFilters?: Partial<ProcessInstancesFilters>) => {
    // Update filters if custom filters provided
    if (newCustomFilters) {
      updateFilters(newCustomFilters);
    }

    // Fetch process instances with the filter values
    fetchProcessInstances(0, processInstancesState.pageSize, newCustomFilters);
  };

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
