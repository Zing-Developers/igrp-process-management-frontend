import { useAreaForm } from "./areas/use-area-form";
import { useAreaOperations } from "./areas/use-area-operations";
import { ExtendedArea, AreaProcessesMap, AreaFormData } from "../types";
import { AreaProcessService } from "../services/area-process.service";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";

export function useAreaHandlers(
  areas: ExtendedArea[],
  setAreas: React.Dispatch<React.SetStateAction<ExtendedArea[]>>,
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>,
) {
  const { igrpToast } = useIGRPToast();
  const areaForm = useAreaForm();
  const areaOperations = useAreaOperations(areas, setAreas);

  const handleCreateArea = async (formData?: AreaFormData) => {
    try {
      // Use the passed formData if available, otherwise fall back to areaForm.formData
      const dataToUse = formData || areaForm.formData;

      await areaOperations.handleCreateArea(dataToUse);
      areaForm.closeModal();

      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Área criada com sucesso",
      });
    } catch (error) {
      console.error("Error creating area:", error);

      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: "error",
          title: "Erro",
          description: "Erro ao criar área. Tente novamente.",
        });
      }

      throw error;
    }
  };

  const handleUpdateArea = async (formData?: AreaFormData) => {
    if (!areaForm.modalState.editingArea) return;

    try {
      // Use the passed formData if available, otherwise fall back to areaForm.formData
      const dataToUse = formData || areaForm.formData;
      await areaOperations.handleUpdateArea(
        areaForm.modalState.editingArea.id,
        dataToUse,
      );
      areaForm.closeModal();

      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Área atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Error updating area:", error);

      igrpToast({
        type: "error",
        title: "Erro ao atualizar área",
        description: "Erro ao atualizar área. Tente novamente.",
      });

      throw error;
    }
  };
  /*
  const handleDeleteArea = async (areaId: string) => {
    try {
      await areaOperations.handleDeleteArea(areaId);

      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Área excluída com sucesso!',
        });
      }
    } catch (error) {
      console.error('Error deleting area:', error);

      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao excluir área. Tente novamente.',
        });
      }

      throw error;
    }
  };*/

  const handleLoadSubareas = async (parentAreaId: string) => {
    try {
      // Load subareas using area operations
      await areaOperations.loadSubareas(parentAreaId);
    } catch (error) {
      console.error("Error loading subareas:", error);

      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao carregar subáreas. Tente novamente.",
      });
    }
  };

  // Add function to load area processes on-demand
  const handleLoadAreaProcesses = async (areaId: string) => {

    try {
      const paginatedResponse =
        await AreaProcessService.getAreaProcesses(areaId);

      // Extract the content array from the paginated response
      const processes = paginatedResponse.content || [];

      // Update the areaProcesses state with the loaded processes
      setAreaProcesses((prev) => ({
        ...prev,
        [areaId]: processes, // Now processes is Process[]
      }));

    } catch (error) {
      console.error("Error loading area processes:", error);

      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao carregar processos da área. Tente novamente.",
      });
    }
  };

  return {
    areaForm,
    areaOperations,
    handleCreateArea,
    handleUpdateArea,
    /*handleDeleteArea,*/
    handleLoadSubareas,
    handleLoadAreaProcesses, // Export the new function
  };
}
