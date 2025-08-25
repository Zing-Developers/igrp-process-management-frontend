import { ProcessData } from '@igrp/platform-process-management-types';
import { AreaProcessService } from '../../services/area-process.service';
import { AreaProcessesMap } from '../../types';

export function useProcessOperations(
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>
) {
  // Extract common logic for reloading area processes
  const reloadAreaProcesses = async (areaId: string) => {
    const updatedProcessesResponse = await AreaProcessService.getAreaProcesses(areaId);
    console.log('updatedProcessesResponse', updatedProcessesResponse);
    
    // Extract the content array from the paginated response
    const updatedProcesses = updatedProcessesResponse.content;
    setAreaProcesses(prev => ({ ...prev, [areaId]: updatedProcesses || [] }));
  };

  const handleAssociateProcess = async (areaId: string, processData: ProcessData) => {
    try {
      await AreaProcessService.associateProcessToArea(areaId, processData);
      
      // Reload area processes for this area
      await reloadAreaProcesses(areaId);
    } catch (error) {
      console.error('Error associating process:', error);
      throw error;
    }
  };

  const handleRemoveProcess = async (areaId: string, processDefinitionId: string) => {
    if (!confirm('Tem certeza que deseja remover este processo da área?')) return;
    
    try {
      await AreaProcessService.removeProcessFromArea(areaId, processDefinitionId);
      
      // Reload area processes for this area
      await reloadAreaProcesses(areaId);
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