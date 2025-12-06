import { useConfiguration } from "./use-configuration";
import { useExpansion } from "./shared/use-expansion";
import { useSearch } from "./use-search";
import { useAreaHandlers } from "./use-area-handlers";
import { useProcessHandlers } from "./use-process-handlers";
import { useComputedValues } from "./use-computed-values";
import { useAccessManagement } from "../../access-management/hooks";

export function useProcessConfiguration() {
  // Configuration data
  const {
    areas,
    setAreas,
    processes,
    areaProcesses,
    setAreaProcesses,
    allActiveProcesses,
    loading,
  } = useConfiguration();

  // Search functionality
  const searchHook = useSearch(areas);

  // Area management - pass setAreaProcesses
  const areaHandlers = useAreaHandlers(areas, setAreas, setAreaProcesses);

  // Process management
  const { loading: processesLoading, ...processHandlers } = useProcessHandlers(
    areaProcesses,
    setAreaProcesses,
    processes,
  );

  // UI state - pass both loadSubareas and loadAreaProcesses functions to expansion
  const expansion = useExpansion();

  // Computed values
  const computedValues = useComputedValues(areas);

  // Enhanced toggle function that integrates with loadSubareas and loadAreaProcesses
  const handleToggleExpansion = async (areaId: string) => {
    await expansion.toggleAreaExpansion(
      areaId,
      areaHandlers.handleLoadSubareas,
      areaHandlers.handleLoadAreaProcesses,
    );
  };

  const { applicationsOptions } = useAccessManagement();

  return {
    // Data
    areas,
    processes,
    areaProcesses,
    loading,
    processesLoading,
    allActiveProcesses,

    // Search
    ...searchHook,

    // Computed values
    ...computedValues,

    // Area management
    ...areaHandlers,

    // Process management
    ...processHandlers,

    // Alert Dialog state
    alertDialog: {
      area: areaHandlers.areaOperations.alertDialog,
      process: processHandlers.processOperations.alertDialog,
    },

    // Artifact management
    artifactForm: processHandlers.artifactForm,
    processArtifacts: processHandlers.artifactForm.processArtifacts,
    handleOpenArtifactModal: processHandlers.handleOpenArtifactModal,
    handleSaveArtifacts: () => processHandlers.artifactForm.saveArtifacts(),

    // Process Number management
    processNumberForm: processHandlers.processNumberForm,
    processNumberConfigs:
      processHandlers.processNumberForm.processNumberConfigs,
    handleOpenProcessNumberModal: processHandlers.handleOpenProcessNumberModal,
    handleSaveProcessNumber: processHandlers.handleSaveProcessNumber,

    // UI state
    expansion: {
      ...expansion,
      handleToggleExpansion,
    },
    applications: applicationsOptions,
  };
}
