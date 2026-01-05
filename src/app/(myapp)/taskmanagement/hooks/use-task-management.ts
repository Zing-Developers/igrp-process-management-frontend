import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Task } from "@igrp/platform-process-management-types";
import { getTasks, assignTask } from "../../external/client/services/task";
import { getDateTemplate, getProcessInfo } from "../../utils/columns-template";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface TaskManagementTableRow {
  currentStep: string;
  process: string;
  assignedBy: string;
  startedAt: string;
  endedAt: string;
  priority: string;
  duration?: string;
  status: string;
  taskId: string;
  taskKey: string;
  processKey?: string;
  processInstanceId?: string;
  processName?: string;
}

interface TaskManagementState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface TaskFilters {
  processNumber?: string;
  processKey?: string;
  user?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

interface AssignTaskModalState {
  isOpen: boolean;
  selectedTask: TaskManagementTableRow | null;
}

export function useTaskManagement() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(1000);
  const [filters, setFilters] = useState<TaskFilters>({});
  const isInitialMount = useRef(true);

  // Add modal state for assign task
  const [assignModalState, setAssignModalState] =
    useState<AssignTaskModalState>({
      isOpen: false,
      selectedTask: null,
    });

  // Reset page to 0 when filters change (except on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(0);
  }, [
    filters.processNumber,
    filters.processKey,
    filters.user,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
    filters.searchTerm,
  ]);

  // Use query to fetch tasks
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "tasks",
      page,
      size,
      filters.processNumber,
      filters.processKey,
      filters.user,
      filters.status,
      filters.dateFrom,
      filters.dateTo,
    ],
    queryFn: () => {
      // Convert filters to API format
      const apiFilters = {
        processNumber: filters.processNumber,
        processKey: filters.processKey,
        user: filters.user,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      };

      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([, value]) => value !== undefined),
      );

      return getTasks(page, size, cleanFilters);
    },
  });

  // Transform state from query result
  const state: TaskManagementState = {
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
    pageSize: data?.pageSize || 1000,
  };

  // Transform tasks data for table display
  const tableData = useMemo((): TaskManagementTableRow[] => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error Allow JSX in table row fields without refactor
    return state.tasks.map((task) => {
      const createdDate = new Date(task.startedAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        currentStep: task.name,
        process: getProcessInfo(task.processName, task.processNumber),
        assignedBy: task.assignedBy || "",
        startedAt: getDateTemplate(task.startedAt),
        endedAt: getDateTemplate(task.endedAt),
        duration: diffDays.toString(),
        status: task.status,
        taskId: task.id,
        taskKey: task.taskKey,
        processKey: task.processKey,
        processInstanceId: task.processInstanceId,
        processName: task.processName,
        priority: task.priority + "",
        statusDesc: task.statusDesc,
        applicationBase: task.applicationBase,
      };
    });
  }, [state.tasks]);

  // Fetch tasks function - now just updates pagination/filter states
  const fetchTasks = useCallback(
    (newPage: number, newSize: number, appliedFilters?: TaskFilters) => {
      setPage(newPage);
      setSize(newSize);
      if (appliedFilters) {
        setFilters(appliedFilters);
      }
    },
    [],
  );

  // Handle search functionality
  const handleSearch = useCallback(
    (searchTerm: string) => {
      const newFilters = { ...filters, searchTerm };
      setFilters(newFilters);
    },
    [filters],
  );

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle filter application
  const applyFilters = useCallback(
    (newFilters?: TaskFilters) => {
      const updatedFilters = newFilters
        ? { ...filters, ...newFilters }
        : filters;
      setFilters(updatedFilters);
    },
    [filters],
  );

  // Handle filter reset
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Update filters function
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Handle opening assign task modal
  const handleOpenAssignModal = useCallback((task: TaskManagementTableRow) => {
    setAssignModalState({
      isOpen: true,
      selectedTask: task,
    });
  }, []);

  // Handle closing assign task modal
  const handleCloseAssignModal = useCallback(() => {
    setAssignModalState({
      isOpen: false,
      selectedTask: null,
    });
  }, []);

  // Handle task assignment
  const handleAssignTask = useCallback(
    async (
      user: string,
      priority: string,
      note?: string,
      candidateGroups?: string,
    ) => {
      if (!assignModalState.selectedTask) return;

      try {
        await assignTask(
          assignModalState.selectedTask.taskId,
          user,
          priority,
          note,
          candidateGroups,
        );

        // Refresh tasks after successful assignment
        await queryClient.refetchQueries({ queryKey: ["tasks"] });

        // Close modal
        handleCloseAssignModal();

        return { success: true, message: "Tarefa atribuída com sucesso!" };
      } catch (error) {
        console.error("Error assigning task:", error);
        return {
          success: false,
          message: "Erro ao atribuir tarefa. Tente novamente.",
        };
      }
    },
    [assignModalState.selectedTask, queryClient, handleCloseAssignModal],
  );

  return {
    // Data
    tableData,
    // State
    loading: state.loading,
    error: state.error,
    totalElements: state.totalElements,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    // Filters
    filters,
    // Assign Task Modal
    assignModalState,
    // Actions
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    updateFilters,
    handleOpenAssignModal,
    handleCloseAssignModal,
    handleAssignTask,
    fetchTasks,
  };
}
