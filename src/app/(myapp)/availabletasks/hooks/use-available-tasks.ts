import { useMemo } from 'react';
import { useAvailableTasksData } from './use-available-tasks-data';
import { TaskTableRow } from '../types';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';

export function useAvailableTasks() {
  const {
    tasksState,
    filters,
    dropdownOptions,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchTasks,
  } = useAvailableTasksData();

  // Transform tasks to table format
  const tableData = useMemo((): TaskTableRow[] => {
    return tasksState.tasks.map(task => {
      // Calculate days waiting
      const createdDate = new Date(task.createdDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        processInfo: task.processName || 'N/A',
        createBy: task.assignee || 'Sistema',
        taskName: task.name,
        status: getStatusLabel(task.status),
        daysWaiting: diffDays.toString(),
        taskId: task.id,
        processInstanceId: task.processInstanceId,
        createdDate: task.createdDate,
        assignee: task.assignee,
      };
    });
  }, [tasksState.tasks]);

  // Transform dropdown options to IGRP format
  const selectAreaOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.areas.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.areas]);

  const selectSubareaOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.subareas.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.subareas]);

  const selectProcesstypeOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.processTypes.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.processTypes]);

  const selectStatusOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.statuses.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.statuses]);

  const selectOrganicOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.organics.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.organics]);

  const selectUserOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.users.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.users]);

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'CREATED':
        return 'Criado';
      case 'ASSIGNED':
        return 'Atribuído';
      case 'COMPLETED':
        return 'Concluído';
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
      default:
        return 'default';
    }
  };

  // Handle filter changes
  const handleAreaChange = (value: string) => {
    updateFilters({ areaId: value, subareaId: '', processType: '' }); // Reset subarea and process type when area changes
  };

  const handleSubareaChange = (value: string) => {
    updateFilters({ subareaId: value, processType: '' }); // Reset process type when subarea changes
  };

  const handleProcessTypeChange = (value: string) => {
    updateFilters({ processType: value });
  };

  const handleStatusChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handleOrganicChange = (value: string) => {
    updateFilters({ organic: value });
  };

  const handleUserChange = (value: string) => {
    updateFilters({ user: value });
  };

  const handleProcessNumberChange = (value: string) => {
    updateFilters({ processNumber: value });
  };

  const handleDateChange = (dateFrom: string, dateTo?: string) => {
    updateFilters({ dateFrom, dateTo: dateTo || '' });
  };

  const handleSearch = (searchTerm: string) => {
    // You can implement search logic here
    // For now, we'll use it as a general filter
    updateFilters({ processKey: searchTerm });
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
    
    // Dropdown options
    selectAreaOptions,
    selectSubareaOptions,
    selectProcesstypeOptions,
    selectStatusOptions,
    selectOrganicOptions,
    selectUserOptions,
    
    // Filter values
    filters,
    
    // Actions
    handleAreaChange,
    handleSubareaChange,
    handleProcessTypeChange,
    handleStatusChange,
    handleOrganicChange,
    handleUserChange,
    handleProcessNumberChange,
    handleDateChange,
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant,
  };
}