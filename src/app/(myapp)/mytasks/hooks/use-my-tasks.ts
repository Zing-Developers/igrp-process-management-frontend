import { useMemo } from 'react';
import { useMyTasksData } from './use-my-tasks-data';
import { TaskTableRow } from '../types';
import { unclaimTask } from '../../external/client/services/task.service';
import { getDateTemplate, getProcessInfo } from '../../utils/columns-template';

export function useMyTasks() {
  const {
    myTasksState,
    unclaimModalState,
    filters,
    updateFilters,
    fetchMyTasks,
    applyFilters,
    resetFilters,
    handleOpenUnclaimModal,
    handleCloseUnclaimModal,
  } = useMyTasksData();



  // Transform tasks data for the table
  const tableData = useMemo((): TaskTableRow[] => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error Allow JSX in table row fields without refactor
    
    return myTasksState.tasks.map((task) => {
      // Calculate waiting days
      const createdDate = new Date(task.startedAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        currentStep: task.name,
        process: getProcessInfo(task.processName, task.processNumber),
        startedAt: getDateTemplate(task.startedAt),
        endAt: getDateTemplate(task.endAt),
        waitingDays: diffDays.toString(),
        priority: task.priority + '',
        processKey: task.processKey,
        processInstanceId: task.processInstanceId,
        taskKey: task.taskKey,
        taskId: task.id,
        processName: task.processName,
        applicationBase: task.applicationBase,
      };
    });
  }, [myTasksState.tasks]);

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    updateFilters({ processType: searchTerm });
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    fetchMyTasks(page, myTasksState.pageSize);
  };

  // Add unclaim task handler
  const handleUnclaimTask = async (note?: string) => {
    if (!unclaimModalState.selectedTask || !unclaimModalState.selectedTask.taskId) {
      return { success: false, message: 'Nenhuma tarefa selecionada' };
    }

    try {
      console.log('unclaimModalState.selectedTask.taskId', unclaimModalState.selectedTask.taskId);
      await unclaimTask(unclaimModalState.selectedTask.taskId, note);

      // Close modal and refresh data
      handleCloseUnclaimModal();
      await fetchMyTasks(myTasksState.currentPage, myTasksState.pageSize);

      return { success: true, message: 'Tarefa libertada com sucesso!' };
    } catch (error) {
      console.error('Error unclaiming task:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao libertar tarefa',
      };
    }
  };

  return {
    // Data
    tableData,
    myTasksState,
    unclaimModalState,
    filters,

    // Actions
    fetchMyTasks,
    applyFilters,
    resetFilters,
    handleSearch,
    handlePageChange,
    updateFilters,
    handleUnclaimTask,
    handleOpenUnclaimModal,
    handleCloseUnclaimModal,

    // State
    loading: myTasksState.loading,
    error: myTasksState.error,
    totalElements: myTasksState.totalElements,
    totalPages: myTasksState.totalPages,
    currentPage: myTasksState.currentPage,
    pageSize: myTasksState.pageSize,
  };
}
