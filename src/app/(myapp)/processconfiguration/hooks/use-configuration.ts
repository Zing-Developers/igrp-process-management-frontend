import { useState, useEffect } from 'react';
import { Process } from '../../external/types/process';
import { getAreas } from '../../external/client/services/area.service';
import { AreaProcessesMap, ExtendedArea } from '../types';
import { organizeAreasHierarchy } from '../utils/area-hierarchy';

export function useConfiguration() {
  const [areas, setAreas] = useState<ExtendedArea[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [areaProcesses, setAreaProcesses] = useState<AreaProcessesMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load only top-level areas (no parentId) - they come with their processes
        const areasResponse = await getAreas(0, 100);
        
        // Organize flat areas into hierarchical structure
        const hierarchicalAreas = organizeAreasHierarchy(areasResponse.content || []);
        setAreas(hierarchicalAreas);
        
        // Extract all processes from areas and build areaProcesses map
        const allProcesses: Process[] = [];
        const areaProcessesMap: AreaProcessesMap = {};
        
        (areasResponse.content || []).forEach((area) => {
          const areaProcessList = area.process || [];
          areaProcessesMap[area.id] = areaProcessList;
          allProcesses.push(...areaProcessList);
        });
        
        setProcesses(allProcesses);
        setAreaProcesses(areaProcessesMap);
        
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