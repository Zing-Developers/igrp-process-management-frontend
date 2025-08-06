import { useState, useEffect } from 'react';
import { getAvailableTasks } from '../../external/client/services/task.service';
import { getAreas } from '../../external/client/services/area.service';
import { getAreaProcesses } from '../../external/client/services/area-process.service';
import { AvailableTasksFilters, AvailableTasksState, DropdownOptions } from '../types';

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

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    areas: [],
    subareas: [],
    processTypes: [],
    statuses: [
      { label: 'Criado', value: 'CREATED' },
      { label: 'Atribuído', value: 'ASSIGNED' },
      { label: 'Concluído', value: 'COMPLETED' },
    ],
    organics: [],
    users: [],
  });

  const [filters, setFilters] = useState<AvailableTasksFilters>({
    processNumber: '',
    processKey: '',
    user: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    areaId: '',
    subareaId: '',
    processType: '',
    organic: '',
  });

  // Load dropdown options
  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        // Load areas
        const areasResponse = await getAreas('', '', 0, 100);
        const areaOptions = areasResponse.content.map((area) => ({
          label: area.name,
          value: area.id,
        }));

        setDropdownOptions((prev) => ({
          ...prev,
          areas: areaOptions,
        }));
      } catch (error) {
        console.error('Error loading dropdown options:', error);
      }
    };

    loadDropdownOptions();
  }, []);

  // Load subareas when area is selected
  useEffect(() => {
    const loadSubareas = async () => {
      console.log('Loading subareas');
      if (!filters.areaId) {
        setDropdownOptions((prev) => ({ ...prev, subareas: [], processTypes: [] }));
        return;
      }

      try {
        const subareasResponse = await getAreas('', '', 0, 100, filters.areaId);
        const subareaOptions = subareasResponse.content.map((subarea) => ({
          label: subarea.name,
          value: subarea.id,
        }));

        setDropdownOptions((prev) => ({
          ...prev,
          subareas: subareaOptions,
        }));
      } catch (error) {
        console.error('Error loading subareas:', error);
        setDropdownOptions((prev) => ({ ...prev, subareas: [], processTypes: [] }));
      }
    };

    loadSubareas();
  }, [filters.areaId]);

  // Load process types when area or subarea is selected
  useEffect(() => {
    const loadProcessTypes = async () => {
      if (!filters.areaId) {
        setDropdownOptions((prev) => ({ ...prev, processTypes: [] }));
        return;
      }

      // Clear dropdown before loading
      setDropdownOptions((prev) => ({ ...prev, processTypes: [] }));

      try {
        const processPromises = [];

        // Always fetch processes from the main area
        processPromises.push(getAreaProcesses(filters.areaId));

        // If subarea is selected, also fetch processes from subarea
        if (filters.subareaId) processPromises.push(getAreaProcesses(filters.subareaId));

        const processResponses = await Promise.all(processPromises);

        // Merge all processes from area and subarea
        const allProcesses = processResponses.flatMap((response) => response.content);

        // Remove duplicates based on processKey
        const uniqueProcesses = allProcesses.filter(
          (process, index, self) =>
            index === self.findIndex((p) => p.processKey === process.processKey),
        );

        const processTypeOptions = uniqueProcesses.map((process) => ({
          label: process.name || process.processKey || 'Processo sem nome',
          value: process.processKey,
        }));

        setDropdownOptions((prev) => ({
          ...prev,
          processTypes: processTypeOptions,
        }));
      } catch (error) {
        console.error('Error loading process types:', error);
        setDropdownOptions((prev) => ({ ...prev, processTypes: [] }));
      }
    };

    loadProcessTypes();
  }, [filters.areaId, filters.subareaId]);

  // Fetch tasks function
  const fetchTasks = async (page = 0, size = 10) => {
    setTasksState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await getAvailableTasks({
        processNumber: filters.processNumber,
        processKey: filters.processKey,
        user: filters.user,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
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
      console.error('Error fetching tasks:', error);
      setTasksState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      }));
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<AvailableTasksFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Apply filters and fetch tasks
  const applyFilters = () => {
    fetchTasks(0, tasksState.pageSize);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      processNumber: '',
      processKey: '',
      user: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      areaId: '',
      subareaId: '',
      processType: '',
      organic: '',
    });
  };

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasksState,
    filters,
    dropdownOptions,
    updateFilters,
    applyFilters,
    resetFilters,
    fetchTasks,
  };
}
