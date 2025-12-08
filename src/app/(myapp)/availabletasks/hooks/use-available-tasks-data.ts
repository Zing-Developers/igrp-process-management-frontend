import { useState, useEffect } from "react";

import { getAvailableTasks } from "../../external/client/services/task";
import { useFilterData } from "../../components/processtaksfilter/hooks/use-filter-data";
import { AvailableTasksFilters, AvailableTasksState } from "../types";

export function useAvailableTasksData() {
  const [tasksState, setTasksState] = useState<AvailableTasksState>({
    tasks: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  // Use the shared filter data hook
  const { filters, dropdownOptions, updateFilters, resetFilters } =
    useFilterData();

  // Add task-specific status options to the shared dropdown options
  const enhancedDropdownOptions = {
    ...dropdownOptions,
    statuses: [
      { label: "Criado", value: "CREATED" },
      { label: "Atribuído", value: "ASSIGNED" },
      { label: "Concluído", value: "COMPLETED" },
    ],
  };

  // Fetch tasks function
  const fetchTasks = async (
    page = 0,
    size = 10,
    customFilters?: Partial<AvailableTasksFilters>,
  ) => {
    setTasksState((prev) => ({ ...prev, loading: true, error: null }));

    // Use custom filters if provided, otherwise use current filters state
    const filtersToUse = customFilters
      ? { ...filters, ...customFilters }
      : filters;
    console.log("Fetching tasks with filters:", filtersToUse);

    try {
      const response = await getAvailableTasks({
        processNumber: filtersToUse.processNumber,
        processKey: filtersToUse.processType || "", // Map processType to processKey
        user: filtersToUse.user,
        status: filtersToUse.status,
        dateFrom: filtersToUse.dateFrom,
        dateTo: filtersToUse.dateTo,
        page,
        size,
      });

      setTasksState({
        tasks: response.content,
        loading: false,
        error: null,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasksState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
      }));
    }
  };

  // Apply filters and fetch tasks
  const applyFilters = (customFilters?: Partial<AvailableTasksFilters>) => {
    // Use a callback to get the most current filter values
    const filtersToApply = customFilters || filters;
    console.log("Applying filters:", filtersToApply);

    // Update filters if custom filters provided
    if (customFilters) {
      updateFilters(customFilters);
    }

    // Fetch tasks with the filter values
    fetchTasks(0, tasksState.pageSize, filtersToApply);
  };

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasksState,
    filters,
    dropdownOptions: enhancedDropdownOptions,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchTasks,
  };
}
