import { useState, useEffect } from 'react';
import { getAreas } from '../../../external/client/services/area.service';
import { getAreaProcesses } from '../../../external/client/services/area-process.service';
import { getProcessInstancesStatus } from '../../../external/client/services/process-instances.service';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownOptions {
  areas: DropdownOption[];
  subareas: DropdownOption[];
  processTypes: DropdownOption[];
  statuses: DropdownOption[];
  organics: DropdownOption[];
  users: DropdownOption[];
}

export interface FilterState {
  areaId: string;
  subareaId: string;
  processType: string;
  processNumber: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  organic: string;
  user: string;
}

export function useDropdownData(filters: FilterState) {
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    areas: [],
    subareas: [],
    processTypes: [],
    statuses: [],
    organics: [],
    users: [],
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

        // Load status options
        const statusOptions = await getProcessInstancesStatus();

        setDropdownOptions((prev) => ({
          ...prev,
          areas: areaOptions,
          statuses: statusOptions,
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

  return {
    dropdownOptions,
  };
}