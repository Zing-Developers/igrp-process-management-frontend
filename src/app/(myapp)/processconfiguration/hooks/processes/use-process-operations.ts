import { ProcessService, CreateProcessRequest } from '../../services/process.service';
import { AreaProcessesMap } from '../../types';

export function useProcessOperations(
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>
) {
  const handleAssociateProcess = async (areaId: string, processData: CreateProcessRequest) => {
    try {
      await ProcessService.associateProcessToArea(areaId, processData);
      
      // Reload area processes for this area
      const updatedProcesses = await ProcessService.getAreaProcesses(areaId);
      setAreaProcesses(prev => ({ ...prev, [areaId]: updatedProcesses || [] }));
    } catch (error) {
      console.error('Error associating process:', error);
      throw error;
    }
  };

  const handleRemoveProcess = async (areaId: string, processDefinitionId: string) => {
    if (!confirm('Tem certeza que deseja remover este processo da área?')) return;
    
    try {
      await ProcessService.removeProcessFromArea(areaId, processDefinitionId);
      
      // Reload area processes for this area
      const updatedProcesses = await ProcessService.getAreaProcesses(areaId);
      setAreaProcesses(prev => ({ ...prev, [areaId]: updatedProcesses || [] }));
    } catch (error) {
      console.error('Error removing process:', error);
      throw error;
    }
  };

  return {
    handleAssociateProcess,
    handleRemoveProcess,
  };
}