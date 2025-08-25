import { useState, useEffect } from 'react';
import { AreaProcessesMap, ExtendedArea } from '../types';
import { organizeAreasHierarchy } from '../utils/area-hierarchy';
import { AreaService } from '../services/area.service';
import { Process } from '@igrp/platform-process-management-types';

export function useConfiguration() {
  const [areas, setAreas] = useState<ExtendedArea[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [areaProcesses, setAreaProcesses] = useState<AreaProcessesMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load only top-level areas (no parentId)
        const areasResponse = await AreaService.getAreas('');
        
        // Organize flat areas into hierarchical structure
        const hierarchicalAreas = organizeAreasHierarchy(areasResponse.content || []);
        setAreas(hierarchicalAreas);
        
        // Extract all processes from areas for the global processes list (for process selection)
        const allProcesses: Process[] = [];
        
        (areasResponse.content || []).forEach((area) => {
          const areaProcessList = area.process || [];
          allProcesses.push(...areaProcessList);
        });
        
        setProcesses(allProcesses);
        
        // Initialize areaProcesses as empty - processes will be loaded on-demand when areas are expanded
        setAreaProcesses({});
        
      } catch (error) {
        console.error('Error loading configuration data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    areas,
    setAreas,
    processes,
    setProcesses,
    areaProcesses,
    setAreaProcesses,
    loading,
  };
}