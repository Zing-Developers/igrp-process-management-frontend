import { useConfiguration } from './use-configuration';
import { useExpansion } from './shared/use-expansion';
import { useSearch } from './use-search';
import { useAreaHandlers } from './use-area-handlers';
import { useProjectHandlers } from './use-project-handlers';
import { useComputedValues } from './use-computed-values';

export function useProcessConfiguration(igrpToast?: any) {
  // Configuration data
  const { areas, setAreas, projects, areaProjects, setAreaProjects, loading } = useConfiguration();
  
  // Search functionality
  const searchHook = useSearch(areas);
  
  // Area management
  const areaHandlers = useAreaHandlers(areas, setAreas, igrpToast);
  
  // Project management
  const projectHandlers = useProjectHandlers(areaProjects, setAreaProjects, projects, igrpToast);
  
  // UI state
  const expansion = useExpansion(areas);
  
  // Computed values
  const computedValues = useComputedValues(areas);

  return {
    // Data
    areas,
    projects,
    areaProjects,
    loading,
    
    // Search
    ...searchHook,
    
    // Computed values
    ...computedValues,
    
    // Area management
    ...areaHandlers,
    
    // Project management
    ...projectHandlers,
    
    // UI state
    expansion,
  };
}