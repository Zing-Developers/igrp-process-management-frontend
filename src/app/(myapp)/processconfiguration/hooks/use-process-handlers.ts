import { useProcessForm } from './processes/use-process-form';
import { useProcessOperations } from './processes/use-process-operations';
import { AreaProcessesMap } from '../types';
import { Process } from '@/app/(myapp)/external/types/process';
import { CreateProcessRequest } from '../services/process.service';

export function useProcessHandlers(
  areaProcesses: AreaProcessesMap,
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>,
  processes: Process[],
  igrpToast?: any
) {
  const processForm = useProcessForm();
  const processOperations = useProcessOperations(areaProcesses, setAreaProcesses);

  const handleAssociateProcess = async (processKey: string) => {
    if (!processForm.modalState.selectedAreaId) return;

    // Find the process by processKey
    const process = processes.find(p => p.processKey === processKey);
    if (!process) {
      console.error('Process not found:', processKey);
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Processo não encontrado.',
        });
      }
      return;
    }

    // Create the request object
    const processData: CreateProcessRequest = {
      processKey: process.processKey,
      releaseId: process.releaseId || '',
      areaId: processForm.modalState.selectedAreaId,
      version: process.version,
    };

    try {
      await processOperations.handleAssociateProcess(
        processForm.modalState.selectedAreaId,
        processData
      );
      processForm.closeModal();
      
      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Processo associado com sucesso!',
        });
      }
    } catch (error) {
      console.error('Error associating process:', error);
      
      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao associar processo. Tente novamente.',
        });
      }
      
      throw error;
    }
  };

  const handleRemoveProcess = async (areaId: string, processDefinitionId: string) => {
    try {
      await processOperations.handleRemoveProcess(areaId, processDefinitionId);
      
      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Processo removido com sucesso!',
        });
      }
    } catch (error) {
      console.error('Error removing process:', error);
      
      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao remover processo. Tente novamente.',
        });
      }
      
      throw error;
    }
  };

  const getAvailableProcesses = (areaId: string) => {
    // Ensure areaProcesses[areaId] is an array before calling .map()
    const areaProcessList = areaProcesses[areaId];
    if (!Array.isArray(areaProcessList)) {
      console.warn(`No processes found for area ${areaId}, returning all available processes`);
      return processes; // Return all processes if no area-specific processes are loaded
    }
    
    const associatedProcessIds = areaProcessList.map((process) => process.id);
    return processes.filter((process) => !associatedProcessIds.includes(process.id));
  };

  return {
    processForm,
    processOperations,
    handleAssociateProcess,
    handleRemoveProcess,
    getAvailableProcesses,
  };
}