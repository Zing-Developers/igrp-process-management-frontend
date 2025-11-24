import { CreateAreaRequest, UpdateAreaRequest } from '@igrp/platform-process-management-types';
import { AreaService } from '../../services/area.service';
import { AreaFormData, ExtendedArea } from '../../types';
import { organizeAreasHierarchy, getAllAreasFlat, findAreaById } from '../../utils/area-hierarchy';
import { useAlertDialog } from '../shared/use-alert-dialog';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';

export function useAreaOperations(
  areas: ExtendedArea[],
  setAreas: React.Dispatch<React.SetStateAction<ExtendedArea[]>>,
) {
  const { igrpToast } = useIGRPToast();
  const alertDialog = useAlertDialog();

  const handleCreateArea = async (formData: AreaFormData) => {
    try {
      const newArea = await AreaService.createArea(formData as CreateAreaRequest);
      // Add the new area to the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas);
      flatAreas.push(newArea);
      const organizedAreas = organizeAreasHierarchy(flatAreas);
      setAreas(organizedAreas);
      return newArea;
    } catch (error) {
      console.error('Error creating area:', error);
      throw error;
    }
  };

  const handleUpdateArea = async (areaId: string, formData: AreaFormData) => {
    try {
      console.log('handleUpdateArea areaId', areaId);
      console.log('handleUpdateArea formData', formData);
      const updatedArea = await AreaService.updateArea(areaId, formData as UpdateAreaRequest);

      // Update the area in the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas);
      const index = flatAreas.findIndex((area) => area.id === areaId);
      if (index !== -1) {
        flatAreas[index] = updatedArea;
      }
      const organizedAreas = organizeAreasHierarchy(flatAreas);
      setAreas(organizedAreas);

      return updatedArea;
    } catch (error) {
      console.error('Error updating area:', error);
      throw error;
    }
  };

  const handleDeleteArea = async (areaId: string) => {
    alertDialog.showAlert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta área? Todas as subáreas também serão removidas.',
      async () => {
        try {
          await AreaService.deleteArea(areaId);

          // Remove the area and its subareas from the flat list and reorganize
          const flatAreas = getAllAreasFlat(areas);
          const filteredAreas = flatAreas.filter(
            (area) => area.id !== areaId && area.areaId !== areaId,
          );
          const organizedAreas = organizeAreasHierarchy(filteredAreas);
          setAreas(organizedAreas);
          if (igrpToast) {
            igrpToast({
              type: 'success',
              title: 'Sucesso',
              description: 'Área excluída com sucesso!',
            });
          }
        } catch (error) {
          console.error('Error deleting area:', error);
          igrpToast({
            type: 'error',
            title: 'Erro',
            description: 'Erro ao excluir área. Tente novamente.',
          });
          throw error;
        }
      },
    );
  };

  const loadSubareas = async (parentAreaId: string) => {
    try {
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

        console.log('loadSubareas flatAreas', flatAreas);
        // Reorganize the hierarchy
        return organizeAreasHierarchy(flatAreas);
      });
    } catch (error) {
      console.error('Error loading subareas:', error);
    }
  };

  const getSubareasForParent = (parentAreaId: string): ExtendedArea[] => {
    const parentArea = findAreaById(areas, parentAreaId);
    return parentArea?.subareas || [];
  };

  return {
    handleCreateArea,
    handleUpdateArea,
    handleDeleteArea,
    loadSubareas,
    getSubareasForParent,
    alertDialog,
  };
}
