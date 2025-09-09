import { useMemo, useCallback } from 'react';
import { useAvailableTasksData } from './use-available-tasks-data';
import { claimTask } from '../../external/client/services/task.service';
import { TaskTableRow } from '../types';
import { getDateTemplate, getProcessInfo, getUserInfo } from '../../utils/columns-template';

export function useAvailableTasks() {
  const { tasksState, filters, updateFilters, applyFilters, resetFilters, fetchTasks } =
    useAvailableTasksData();

  // Transform tasks to table format
 
  const tableData = useMemo((): TaskTableRow[] => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error Allow JSX in table row fields without refactor
    return tasksState.tasks.map((task) => {
      // Calculate days waiting
      const createdDate = new Date(task.startedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//TODO: Fix this
      return {
        processInfo: getProcessInfo(task.processName, task.processNumber),
        processNumber: task.processNumber,
        startedAt: getDateTemplate(task.startedAt),
        endAt: null,//getDateTemplate(task.endAt ?? ''),
        createBy: getUserInfo(task.assignedBy),
        taskName: task.name,
        status: task.status,
        daysWaiting: diffDays.toString(),
        taskId: task.id,
        processInstanceId: task.processInstanceId,
        createdDate: task.startedAt,
        assignedBy: task.assignedBy,
        priority: task.priority + '',
      };
    });
  }, [tasksState.tasks]);

  // Claim task function
  const handleClaimTask = useCallback(
    async (taskId: string, user: string, note?: string) => {
      try {
        await claimTask(taskId, user, note);
        // Refresh tasks after claiming
        fetchTasks(tasksState.currentPage, tasksState.pageSize);
        return { success: true };
      } catch (error) {
        console.error('Error claiming task:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao assumir tarefa',
        };
      }
    },
    [fetchTasks, tasksState.currentPage, tasksState.pageSize],
  );

  const handleSearch = (searchTerm: string) => {
    updateFilters({ processType: searchTerm });
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    fetchTasks(page, tasksState.pageSize);
  };

  return {
    // Data
    tableData,
    loading: tasksState.loading,
    error: tasksState.error,
    totalElements: tasksState.totalElements,
    totalPages: tasksState.totalPages,
    currentPage: tasksState.currentPage,

    // Filter values
    filters,

    // Actions
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    fetchTasks,
    handleClaimTask,
  };
}
