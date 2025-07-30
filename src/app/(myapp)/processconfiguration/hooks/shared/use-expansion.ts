import { useState } from 'react';
import { ExpandedAreas } from '../../types';

export function useExpansion() {
  const [expandedAreas, setExpandedAreas] = useState<ExpandedAreas>({});
  const [loadedSubareas, setLoadedSubareas] = useState<Set<string>>(new Set());

  const toggleAreaExpansion = async (
    areaId: string,
    loadSubareasCallback: (areaId: string) => Promise<void>,
  ) => {
    console.log('useExpansion areaid:', areaId);
    const isExpanded = expandedAreas[areaId];
    setExpandedAreas((prev) => ({ ...prev, [areaId]: !isExpanded }));

    // Only load subareas if expanding and they haven't been loaded yet
    console.log("expandedAreas", expandedAreas)
    console.log("isExpanded", isExpanded)
    console.log("loadedSubareas", loadedSubareas)
    if (!isExpanded && !loadedSubareas.has(areaId)) {
      console.log('Loading subareas for area:', areaId);
      await loadSubareasCallback(areaId);
      setLoadedSubareas((prev) => new Set(prev).add(areaId));
    }
  };

  return {
    expandedAreas,
    toggleAreaExpansion,
    loadedSubareas,
  };
}
