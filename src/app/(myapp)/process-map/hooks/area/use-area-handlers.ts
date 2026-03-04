import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import { useAreaForm } from "./use-area-form";
import {
  createArea,
  deleteArea,
  getSubareas,
  updateArea,
} from "@/app/(myapp)/client/area";
import {
  CreateAreaRequest,
  Process,
  UpdateAreaRequest,
} from "@igrp/platform-process-management-types";
import { findAreaById } from "../../utils/area-hierarchy";
import { AreaFormData, ExtendedArea } from "../../types";

export function useAreaHandlers(
  areas: ExtendedArea[],
  handleAssociateProcess: (
    areaId: string,
    processData: Process,
  ) => Promise<void>,
  handleRemoveProcess: (
    areaId: string,
    processDefinitionId: string,
  ) => Promise<void>,
  refreshData: () => void | Promise<void>,
) {
  const { igrpToast } = useIGRPToast();

  const areaForm = useAreaForm();

  const handleCreateArea = async (formData: AreaFormData) => {
    try {
      const newArea = await createArea(formData as CreateAreaRequest);

      for (const process of formData.processes || []) {
        await handleAssociateProcess(newArea.id, {
          ...process,
          releaseId: process.id,
        });
      }

      refreshData();

      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Área criada com sucesso!",
      });

      return newArea;
    } catch (error) {
      console.error("Error creating area:", error);
      throw error;
    }
  };

  const handleUpdateArea = async (areaId: string, formData: AreaFormData) => {
    try {
      const updatedArea = await updateArea(
        areaId,
        formData as UpdateAreaRequest,
      );

      for (const process of formData.processes || []) {
        await handleAssociateProcess(areaId, {
          ...process,
          releaseId: process.releaseId ?? process.id,
        });
      }

      refreshData();

      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Área atualizada com sucesso!",
      });

      return updatedArea;
    } catch (error) {
      console.error("Error updating area:", error);
      throw error;
    }
  };

  const handleDeleteArea = async (areaId: string) => {
    try {
      await deleteArea(areaId);

      refreshData();
      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Área excluída com sucesso!",
      });
    } catch (error) {
      console.error("Error deleting area:", error);
      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao excluir área. Tente novamente.",
      });
      throw error;
    }
  };

  const loadSubareas = async (parentAreaId: string) => {
    try {
      await getSubareas(parentAreaId);
      await refreshData();
    } catch (error) {
      console.error("Error loading subareas:", error);
    }
  };

  const getSubareasForParent = (parentAreaId: string): ExtendedArea[] => {
    const parentArea = findAreaById(areas, parentAreaId);
    return parentArea?.subareas || [];
  };

  return {
    areaForm,
    handleCreateArea,
    handleUpdateArea,
    handleDeleteArea,
    loadSubareas,
    getSubareasForParent,
  };
}
