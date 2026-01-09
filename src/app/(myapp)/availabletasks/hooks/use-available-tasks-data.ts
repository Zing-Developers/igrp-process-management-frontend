import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvailableTasks } from "../../external/client/services/task";
import { useFilterData } from "../../components/processtaksfilter/hooks/use-filter-data";
import { AvailableTasksFilters, AvailableTasksState } from "../types";

export function useAvailableTasksData() {
  // Use the shared filter data hook
  const { filters, dropdownOptions, updateFilters, resetFilters } =
    useFilterData();

  const queryClient = useQueryClient();

  // Add task-specific status options to the shared dropdown options
  const enhancedDropdownOptions = {
    ...dropdownOptions,
    statuses: [
      { label: "Criado", value: "CREATED" },
      { label: "Atribuído", value: "ASSIGNED" },
      { label: "Concluído", value: "COMPLETED" },
    ],
  };

  // State for pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [customFilters, setCustomFilters] = useState<
    Partial<AvailableTasksFilters> | undefined
  >();

  // Use query at the top level - hooks must be called at the top level
  const { data, isLoading, error } = useQuery({
    queryKey: ["available-tasks", page, size, filters, customFilters],
    queryFn: () => {
      // Use custom filters if provided, otherwise use current filters state
      const filtersToUse = customFilters
        ? { ...filters, ...customFilters }
        : filters;

      return getAvailableTasks({
        ...filtersToUse,
        dateFrom: filtersToUse.dateFrom || undefined,
        dateTo: filtersToUse.dateTo || undefined,
        page,
        size,
      });
    },
  });

  // Transform query result to state format
  const tasksState: AvailableTasksState = {
    tasks: data?.content || [],
    loading: isLoading,
    error:
      error instanceof Error
        ? error.message
        : error
          ? "Failed to fetch tasks"
          : null,
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.pageNumber || 0,
    pageSize: data?.pageSize || 10,
  };

  // Fetch tasks function - now just updates state to trigger refetch
  const fetchTasks = (
    newPage = 0,
    newSize = 10,
    newCustomFilters?: Partial<AvailableTasksFilters>,
  ) => {
    setPage(newPage);
    setSize(newSize);
    setCustomFilters(newCustomFilters);
  };

  // Apply filters and fetch tasks
  const applyFilters = (newCustomFilters?: Partial<AvailableTasksFilters>) => {
    // Update filters if custom filters provided
    if (newCustomFilters) {
      updateFilters(newCustomFilters);
    }

    // Fetch tasks with the filter values
    fetchTasks(0, tasksState.pageSize, newCustomFilters);
  };

  const refetchTasks = () => {
    queryClient.invalidateQueries({ queryKey: ["available-tasks"] });
  };

  return {
    tasksState,
    filters,
    dropdownOptions: enhancedDropdownOptions,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchTasks,
    refetchTasks,
  };
}
