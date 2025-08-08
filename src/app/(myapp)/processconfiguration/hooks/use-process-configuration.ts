import { useConfiguration } from './use-configuration';
import { useExpansion } from './shared/use-expansion';
import { useSearch } from './use-search';
import { useAreaHandlers } from './use-area-handlers';
import { useProcessHandlers } from './use-process-handlers';
import { useComputedValues } from './use-computed-values';

export function useProcessConfiguration(igrpToast?: any) {
  // Configuration data
  const { areas, setAreas, processes, areaProcesses, setAreaProcesses, loading } =
    useConfiguration();

  // Search functionality
  const searchHook = useSearch(areas);

  // Area management - pass setAreaProcesses
  const areaHandlers = useAreaHandlers(areas, setAreas, setAreaProcesses, igrpToast);

  // Debug: Log what areaHandlers contains
  console.log("areaHandlers keys:", Object.keys(areaHandlers));
  console.log("areaHandlers.handleLoadAreaProcesses:", areaHandlers.handleLoadAreaProcesses);
  console.log("typeof areaHandlers.handleLoadAreaProcesses:", typeof areaHandlers.handleLoadAreaProcesses);

  // Process management
  const { loading: processesLoading, ...processHandlers } = useProcessHandlers(areaProcesses, setAreaProcesses, processes, igrpToast);

  // UI state - pass both loadSubareas and loadAreaProcesses functions to expansion
  const expansion = useExpansion();

  // Computed values
  const computedValues = useComputedValues(areas);

  // Enhanced toggle function that integrates with loadSubareas and loadAreaProcesses
  const handleToggleExpansion = async (areaId: string) => {    
    await expansion.toggleAreaExpansion(
      areaId, 
      areaHandlers.handleLoadSubareas,
      areaHandlers.handleLoadAreaProcesses
    );
  };

  return {
    // Data
    areas,
    processes,
    areaProcesses,
    loading,
    processesLoading,

    // Search
    ...searchHook,

    // Computed values
    ...computedValues,

    // Area management
    ...areaHandlers,

    // Process management
    ...processHandlers,

    // UI state
    expansion: {
      ...expansion,
      handleToggleExpansion,
    },
  };
}
