import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, PaginatedResponse } from '@igrp/platform-process-management-types';
import { getTasks } from '../../external/client/services/task.service';
import { getTaskStatusLabel, getTaskStatusVariant } from '../../utils/status-helpers';

export interface TaskManagementTableRow {
  process: string;
  createBy: string;
  currentStep: string;
  waitingDays: string;
  status: string;
  taskId: string;
  taskKey: string;
  processInstanceId: string;
  processKey: string;
  assignedBy?: string;
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
        status: getTaskStatusLabel(task.status),
        taskId: task.id,
        taskKey: task.taskKey || task.name,
        processInstanceId: task.processInstanceId,
        processKey: task.processKey || 'unknown',
        assignedBy: task.assignedBy,
        createdDate: task.startedAt,
      };
    });
  }, [state.tasks]);

  // Fetch tasks function with filters
  const fetchTasks = useCallback(async (page = 0, size = 10, appliedFilters?: TaskFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Convert filters to API format
      const apiFilters = {
        processNumber: appliedFilters?.processNumber,
        processKey: appliedFilters?.processKey,
        user: appliedFilters?.user,
        status: appliedFilters?.status,
        dateFrom: appliedFilters?.dateFrom,
        dateTo: appliedFilters?.dateTo,
      };

      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([_, value]) => value !== undefined)
      );

      const response: PaginatedResponse<Task> = await getTasks(page, size, cleanFilters);
      
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
    const newFilters = { ...filters, searchTerm };
    setFilters(newFilters);
    fetchTasks(0, state.pageSize, newFilters);
  }, [filters, fetchTasks, state.pageSize]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchTasks(page, state.pageSize, filters);
  }, [fetchTasks, state.pageSize, filters]);

  // Handle filter application
  const applyFilters = useCallback((newFilters?: TaskFilters) => {
    const updatedFilters = newFilters ? { ...filters, ...newFilters } : filters;
    setFilters(updatedFilters);
    fetchTasks(0, state.pageSize, updatedFilters);
  }, [filters, fetchTasks, state.pageSize]);

  // Handle filter reset
  const resetFilters = useCallback(() => {
    setFilters({});
    fetchTasks(0, state.pageSize, {});
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
    getStatusVariant: getTaskStatusVariant,
    fetchTasks,
  };
}