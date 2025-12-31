import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAreas } from "../../../external/client/services/area";
import { getAreaProcesses } from "../../../external/client/services/area-process";
import { getProcessInstancesStatus } from "../../../external/client/services/process-instances";
import { VariableFilter } from "../../filter-data";

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
  dateFrom: string | null;
  dateTo: string | null;
  organic: string;
  user: string;
  variables: VariableFilter[];
}

export function useDropdownData(filters: FilterState) {
  // Load areas and statuses
  const { data: areasData } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const areasResponse = await getAreas("", 0, 100);
      return areasResponse.content.map((area) => ({
        label: area.name,
        value: area.id,
      }));
    },
  });

  const { data: statusesData } = useQuery({
    queryKey: ["process-instances-status"],
    queryFn: () => getProcessInstancesStatus(),
  });

  // Load subareas when area is selected
  const { data: subareasData } = useQuery({
    queryKey: ["subareas", filters.areaId],
    queryFn: async () => {
      if (!filters.areaId) return [];
      const subareasResponse = await getAreas("", 0, 100, filters.areaId);
      return subareasResponse.content.map((subarea) => ({
        label: subarea.name,
        value: subarea.id,
      }));
    },
    enabled: !!filters.areaId,
  });

  // Load process types when area or subarea is selected
  const { data: processTypesData } = useQuery({
    queryKey: ["process-types", filters.areaId, filters.subareaId],
    queryFn: async () => {
      if (!filters.areaId) return [];

      const processPromises = [];

      // Always fetch processes from the main area
      processPromises.push(getAreaProcesses(filters.areaId));

      // If subarea is selected, also fetch processes from subarea
      if (filters.subareaId) {
        processPromises.push(getAreaProcesses(filters.subareaId));
      }

      const processResponses = await Promise.all(processPromises);

      // Merge all processes from area and subarea
      const allProcesses = processResponses.flatMap(
        (response) => response.content,
      );

      // Remove duplicates based on processKey
      const uniqueProcesses = allProcesses.filter(
        (process, index, self) =>
          index === self.findIndex((p) => p.processKey === process.processKey),
      );

      return uniqueProcesses.map((process) => ({
        label: process.name || process.processKey || "Processo sem nome",
        value: process.processKey,
      }));
    },
    enabled: !!filters.areaId,
  });

  // Combine all dropdown options
  const dropdownOptions = useMemo<DropdownOptions>(
    () => ({
      areas: areasData || [],
      subareas: subareasData || [],
      processTypes: processTypesData || [],
      statuses: statusesData || [],
      organics: [],
      users: [],
    }),
    [areasData, subareasData, processTypesData, statusesData],
  );

  return {
    dropdownOptions,
  };
}
