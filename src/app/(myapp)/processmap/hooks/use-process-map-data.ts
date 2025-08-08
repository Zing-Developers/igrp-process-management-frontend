import { useState, useEffect, useCallback } from 'react';
import { ExtendedArea } from '../../processconfiguration/types';
import { AreaService } from '../../processconfiguration/services/area.service';
import { organizeAreasHierarchy, getAllAreasFlat } from '../../processconfiguration/utils/area-hierarchy';

export function useProcessMapData() {
  const [areas, setAreas] = useState<ExtendedArea[]>([]);
  const [loadedNodes, setLoadedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      // Load only top-level areas initially (areas without areaId)
      const areasResponse = await AreaService.getAreas('');
      console.log("areasResponse", areasResponse);
      
      // Filter to get only top-level areas
      const topLevelAreas = areasResponse.content?.filter(area => !area.areaId) || [];
      
      // Convert to ExtendedArea format
      const extendedAreas: ExtendedArea[] = topLevelAreas.map(area => ({
        ...area,
        subareas: [] // Will be loaded on-demand
      }));
      
      console.log("topLevelAreas", extendedAreas);
      setAreas(extendedAreas);
    } catch (err) {
      setError('Failed to load process map data');
      console.error('Error loading process map data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubareas = useCallback(async (parentAreaId: string) => {
    try {
      // Check if already loaded
      if (loadedNodes.has(parentAreaId)) {
        return;
      }

      console.log("Loading subareas for parent area:", parentAreaId);
      const subareas = await AreaService.getSubareas(parentAreaId);
      console.log('loadSubareas subareas', subareas);

      // Update the areas state to include the loaded subareas
      setAreas((prev) => {
        const flatAreas = getAllAreasFlat(prev);
        console.log('loadSubareas flatAreas', flatAreas);

        // Add the new subareas to the flat list if they don't already exist
        subareas.forEach((subarea) => {
          const exists = flatAreas.find((area) => area.id === subarea.id);
          if (!exists) {
            flatAreas.push(subarea);
          }
        });

        console.log('loadSubareas updated flatAreas', flatAreas);
        // Reorganize the hierarchy
        return organizeAreasHierarchy(flatAreas);
      });

      // Mark this node as loaded
      setLoadedNodes(prev => new Set([...prev, parentAreaId]));
    } catch (error) {
      console.error('Error loading subareas:', error);
      throw error;
    }
  }, [loadedNodes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    setLoadedNodes(new Set()); // Reset loaded nodes
    await loadData();
  }, [loadData]);

  return {
    areas,
    loadedNodes,
    loading,
    error,
    loadSubareas,
    refreshData,
  };
}