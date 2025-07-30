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

  // Process management
  const processHandlers = useProcessHandlers(areaProcesses, setAreaProcesses, processes, igrpToast);

  // UI state - pass the loadSubareas function to expansion
  const expansion = useExpansion();

  // Computed values
  const computedValues = useComputedValues(areas);

  // Enhanced toggle function that integrates with loadSubareas
  const handleToggleExpansion = async (areaId: string) => {
    console.log("Toggling expansion for area 2:", areaId);
    await expansion.toggleAreaExpansion(areaId, areaHandlers.handleLoadSubareas);
  };

  return {
    // Data
    areas,
    processes,
    areaProcesses,
    loading,

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
