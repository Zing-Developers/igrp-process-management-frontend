import { useState, useCallback, useMemo } from "react";
import { getTasks, assignTask } from "../../client/task";
import { getProcessDefinitionPriorities } from "../../client/process";
import {
  getDateTemplate,
  getProcessInfo,
  getPriorityTemplate,
  formatDuration,
} from "../../utils/columns-template";
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  AssignTaskModalState,
  TaskManagementFilters,
  TaskManagementState,
  TaskManagementTableRow,
} from "../types";
import {
  getPriorityBadgeFromApi,
  type ApiPriorityInfo,
} from "../../utils/status-badge";

export function useTaskManagement() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<TaskManagementFilters>({});

  // Add modal state for assign task
  const [assignModalState, setAssignModalState] =
    useState<AssignTaskModalState>({
      isOpen: false,
      selectedTask: null,
    });

  // Use query to fetch tasks
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => {
      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined),
      );

      return getTasks(cleanFilters);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retryDelay: 1000,
  });

  const { content, ...rest } = data ?? {};
  // Transform state from query result
  const state: TaskManagementState = {
    ...rest,
    tasks: content || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? error : null,
  };

  // Unique process keys from current tasks (for loading priorities per process)
  const processKeys = useMemo(() => {
    const keys = new Set<string>();
    state.tasks.forEach((t) => {
      if (t.processKey) keys.add(t.processKey);
    });
    return Array.from(keys);
  }, [state.tasks]);

  const priorityQueries = useQueries({
    queries: processKeys.map((processKey) => ({
      queryKey: ["process-priorities", processKey],
      queryFn: () => getProcessDefinitionPriorities(processKey),
      enabled: !!processKey,
    })),
  });

  // Map: processKey -> priority value -> { label, value, color }
  const prioritiesByProcessKey = useMemo((): Record<
    string,
    Record<string, ApiPriorityInfo>
  > => {
    const map: Record<string, Record<string, ApiPriorityInfo>> = {};
    processKeys.forEach((processKey, i) => {
      const list = priorityQueries[i]?.data ?? [];
      map[processKey] = {};
      list.forEach((p) => {
        const value = String(p.code ?? "");
        if (value) {
          map[processKey][value] = {
            label: p.label ?? value,
            value,
            color: p.color,
          };
        }
      });
    });
    return map;
  }, [processKeys, priorityQueries]);

  const getPriorityBadge = useCallback(
    (processKey: string | undefined, priorityValue: string) => {
      const apiPriority = processKey
        ? prioritiesByProcessKey[processKey]?.[priorityValue]
        : undefined;
      return getPriorityBadgeFromApi(apiPriority, { priority: priorityValue });
    },
    [prioritiesByProcessKey],
  );

  // Transform tasks data for table display
  const tableData = useMemo((): TaskManagementTableRow[] => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error Allow JSX in table row fields without refactor
    return state.tasks.map((task) => {
      const createdDate = new Date(task.startedAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const priorityValue = task.priority + "";

      return {
        currentStep: task.name,
        process: getProcessInfo(task.processName, task.processNumber),
        assignedBy: task.assignedBy || "",
        startedAt: getDateTemplate(task.startedAt),
        endedAt: getDateTemplate(task.endedAt),
        duration: formatDuration(diffTime),
        status: task.status,
        taskId: task.id,
        taskKey: task.taskKey,
        processKey: task.processKey,
        processInstanceId: task.processInstanceId,
        processName: task.processName,
        priority: getPriorityTemplate(
          getPriorityBadge(task.processKey, priorityValue),
          priorityValue,
        ),
        statusDesc: task.statusDesc,
        applicationBase: task.applicationBase,
      };
    });
  }, [state.tasks, getPriorityBadge]);

  // Fetch tasks function - now just updates pagination/filter states
  const fetchTasks = useCallback((appliedFilters?: TaskManagementFilters) => {
    if (appliedFilters) {
      setFilters(appliedFilters);
    }
  }, []);

  // Handle search functionality
  const handleSearch = useCallback(
    (searchTerm: string) => {
      const newFilters = { ...filters, searchTerm };
      setFilters(newFilters);
    },
    [filters],
  );

  // Handle filter application
  const applyFilters = useCallback(
    (newFilters?: TaskManagementFilters) => {
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
  const updateFilters = useCallback(
    (newFilters: Partial<TaskManagementFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

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
    // Filters
    filters,
    // Priority badge (uses API per process definition)
    getPriorityBadge,
    // Assign Task Modal
    assignModalState,
    // Actions
    handleSearch,
    applyFilters,
    resetFilters,
    updateFilters,
    handleOpenAssignModal,
    handleCloseAssignModal,
    handleAssignTask,
    fetchTasks,
  };
}
