import { useState } from 'react';
import { ExpandedAreas } from '../../types';

export function useExpansion() {
  const [expandedAreas, setExpandedAreas] = useState<ExpandedAreas>({});
  const [loadedSubareas, setLoadedSubareas] = useState<Set<string>>(new Set());
  const [loadedProcesses, setLoadedProcesses] = useState<Set<string>>(new Set()); // Track loaded processes

  const toggleAreaExpansion = async (
    areaId: string,
    loadSubareasCallback: (areaId: string) => Promise<void>,
    loadProcessesCallback?: (areaId: string) => Promise<void>, // Add optional processes callback
  ) => {
    console.log('useExpansion areaid:', areaId);
    const isExpanded = expandedAreas[areaId];
    setExpandedAreas((prev) => ({ ...prev, [areaId]: !isExpanded }));

    // Only load content if expanding and it hasn't been loaded yet
    console.log("expandedAreas", expandedAreas)
    console.log("isExpanded", isExpanded)
    console.log("loadedSubareas", loadedSubareas)
    console.log("loadedProcesses", loadedProcesses)
    
    if (!isExpanded) {
      // Load subareas if they haven't been loaded yet
      if (!loadedSubareas.has(areaId)) {
        console.log('Loading subareas for area:', areaId);
        await loadSubareasCallback(areaId);
        setLoadedSubareas((prev) => new Set(prev).add(areaId));
      }
      
      // Load processes if they haven't been loaded yet and callback is provided
      if (loadProcessesCallback && !loadedProcesses.has(areaId)) {
        console.log('Loading processes for area:', areaId);
        await loadProcessesCallback(areaId);
        setLoadedProcesses((prev) => new Set(prev).add(areaId));
      }
    }
  };

  return {
    expandedAreas,
    toggleAreaExpansion,
    loadedSubareas,
    loadedProcesses,
  };
}
