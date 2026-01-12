import { useState, useEffect, useRef } from "react";
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
  const isInitialMount = useRef(true);

  // Reset page to 0 when filters change (except on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(0);
  }, [
    filters.processType,
    filters.processNumber,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
    filters.areaId,
    filters.subareaId,
    filters.organic,
    filters.user,
    filters.variables,
  ]);

  // Use query at the top level - hooks must be called at the top level
  // Use individual filter values in queryKey to ensure automatic reactivity
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "process-instances",
      page,
      size,
      filters.processType,
      filters.processNumber,
      filters.status,
      filters.dateFrom,
      filters.dateTo,
      filters.areaId,
      filters.subareaId,
      filters.organic,
      filters.user,
      filters.variables,
    ],
    queryFn: () => {
      return getProcessInstances(
        page,
        size,
        filters as Partial<ProcessInstancesFilters>,
      );
    },
  });

  // Transform query result to state format
  const processInstancesState: ProcessInstancesState = {
    processInstances: data?.content || [],
    loading: isLoading,
    error:
      error instanceof Error
        ? error.message
        : error
          ? "Failed to fetch process instances"
          : null,
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.pageNumber || 0,
    pageSize: data?.pageSize || 1000,
  };

  // Fetch process instances function - now just updates pagination state
  const fetchProcessInstances = (newPage = 0, newSize = 1000) => {
    setPage(newPage);
    setSize(newSize);
  };

  // Apply filters - now just updates filters, query will auto-refetch
  const applyFilters = (
    newCustomFilters?: Partial<ProcessInstancesFilters>,
  ) => {
    // Update filters if custom filters provided
    // The query will automatically refetch when filters change
    if (newCustomFilters) {
      updateFilters(newCustomFilters);
    }
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
