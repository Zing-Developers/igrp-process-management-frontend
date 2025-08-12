import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, PaginatedResponse } from '@igrp/platform-process-management-types';
import { getTasks } from '../../external/client/services/task.service';

export interface TaskManagementTableRow {
  process: string;
  createBy: string;
  currentStep: string;
  waitingDays: string;
  status: string;
  taskId: string;
  taskKey: string;
  processInstanceId?: string;
  processKey?: string;
  assignee?: string;
  createdDate?: string;
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

export function useTaskManagement() {
  const [state, setState] = useState<TaskManagementState>({
    tasks: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<TaskFilters>({});

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'Criado';
      case 'ASSIGNED':
        return 'Atribuído';
      case 'COMPLETED':
        return 'Concluído';
      case 'CANCELLED':
        return 'Cancelado';
      case 'DELETED':
        return 'Excluído';
      default:
        return status;
    }
  };

  // Helper function to get status variant for badge
  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'info';
      case 'ASSIGNED':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'destructive';
      case 'DELETED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Transform tasks data for table display
  const tableData = useMemo((): TaskManagementTableRow[] => {
    return state.tasks.map((task) => {
      const createdDate = new Date(task.startedAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        process: task.processName || task.name,
        createBy: task.assignedBy || 'Sistema',
        currentStep: task.name,
        waitingDays: diffDays.toString(),
        status: getStatusLabel(task.status),
        taskId: task.id,
        taskKey: task.taskKey,
        processInstanceId: task.processInstanceId,
        processKey: task.processKey || 'unknown',
        assignee: task.assignedBy,
        createdDate: task.startedAt,
      };
    });
  }, [state.tasks]);

  // Fetch tasks function
  const fetchTasks = useCallback(async (page = 0, size = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: PaginatedResponse<Task> = await getTasks(page, size);
      
      setState(prev => ({
        ...prev,
        tasks: response.content || [],
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        currentPage: page,
        pageSize: size,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar tarefas. Tente novamente.',
      }));
    }
  }, []);

  // Handle search functionality
  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    // For now, we'll just refetch with the current page
    // In a real implementation, you might want to pass search parameters to the API
    fetchTasks(0, state.pageSize);
  }, [fetchTasks, state.pageSize]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchTasks(page, state.pageSize);
  }, [fetchTasks, state.pageSize]);

  // Handle filter application
  const applyFilters = useCallback((newFilters?: TaskFilters) => {
    if (newFilters) {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
    // Refetch tasks with current filters
    fetchTasks(0, state.pageSize);
  }, [fetchTasks, state.pageSize]);

  // Handle filter reset
  const resetFilters = useCallback(() => {
    setFilters({});
    fetchTasks(0, state.pageSize);
  }, [fetchTasks, state.pageSize]);

  // Load initial data
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

    // Actions
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant,
    fetchTasks,
  };
}