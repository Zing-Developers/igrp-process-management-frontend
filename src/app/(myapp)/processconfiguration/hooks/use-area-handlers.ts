import { useAreaForm } from './areas/use-area-form';
import { useAreaOperations } from './areas/use-area-operations';
import { ExtendedArea } from '../types';

export function useAreaHandlers(
  areas: ExtendedArea[],
  setAreas: React.Dispatch<React.SetStateAction<ExtendedArea[]>>,
  igrpToast?: any,
) {
  const areaForm = useAreaForm();
  const areaOperations = useAreaOperations(areas, setAreas);

  const handleCreateArea = async (formData?: any) => {
    try {
      // Use the passed formData if available, otherwise fall back to areaForm.formData
      const dataToUse = formData || areaForm.formData;
      console.log("Creating area with data:", dataToUse);
      await areaOperations.handleCreateArea(dataToUse);
      areaForm.closeModal();

      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Área criada com sucesso',
        });
      }
    } catch (error) {
      console.error('Error creating area:', error);

      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao criar área. Tente novamente.',
        });
      }

      throw error;
    }
  };

  const handleUpdateArea = async (formData?: any) => {
    if (!areaForm.modalState.editingArea) return;

    try {
      // Use the passed formData if available, otherwise fall back to areaForm.formData
      const dataToUse = formData || areaForm.formData;
      await areaOperations.handleUpdateArea(areaForm.modalState.editingArea.id, dataToUse);
      areaForm.closeModal();

      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Área atualizada com sucesso!',
        });
      }
    } catch (error) {
      console.error('Error updating area:', error);

      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro ao atualizar área',
          description: 'Erro ao atualizar área. Tente novamente.',
        });
      }

      throw error;
    }
  };

  return {
    areaForm,
    areaOperations,
    handleCreateArea,
    handleUpdateArea,
  };
}
