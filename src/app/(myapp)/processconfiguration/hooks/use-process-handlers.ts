import { useProcessForm } from './processes/use-process-form';
import { useProcessOperations } from './processes/use-process-operations';
import { useArtifactForm } from './artifacts/use-artifact-form';
import { useArtifactOperations } from './artifacts/use-artifact-operations';
import { AreaProcessesMap } from '../types';
import { ProcessService } from '../services/process.service';
import { useState, useEffect } from 'react';
import { Process, ProcessData } from '@igrp/platform-process-management-types';

export function useProcessHandlers(
  areaProcesses: AreaProcessesMap,
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>,
  processes: Process[],
  igrpToast?: any,
) {
  const [allProcesses, setAllProcesses] = useState<Process[]>(processes);
  const [loading, setLoading] = useState(false);

  const processForm = useProcessForm();
  const processOperations = useProcessOperations(setAreaProcesses);
  const artifactForm = useArtifactForm();
  const artifactOperations = useArtifactOperations();

  // Load all processes from API when component mounts or when needed
  const loadAllProcesses = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await ProcessService.getProcesses(0, 100);
      setAllProcesses(response.content || []);
    } catch (error) {
      console.error('Error loading processes:', error);
      // Keep using the passed processes as fallback
      setAllProcesses(processes);
    } finally {
      setLoading(false);
    }
  };

  // Load processes on mount if we don't have any
  useEffect(() => {
    if (allProcesses.length === 0) {
      loadAllProcesses();
    }
  }, []);

  const handleAssociateProcess = async (processKey: string) => {
    if (!processForm.modalState.selectedAreaId) return;

    // Find the process by processKey from our loaded processes
    const process = allProcesses.find((p) => p.processKey === processKey);
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
    console.log('process', process);
    // Create the request object
    const processData: ProcessData = {
      processKey: process.processKey || '',
      name: process.name || '',
      releaseId: process.id || '',
      version: process.version.toString(),
    };

    try {
      await processOperations.handleAssociateProcess(
        processForm.modalState.selectedAreaId,
        processData,
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
      return allProcesses; // Return all loaded processes if no area-specific processes are loaded
    }
    const associatedProcessIds = areaProcessList.map((process) => process.processKey);
    const filteredProcesses = allProcesses.filter(
      (process) => !associatedProcessIds.includes(process.processKey),
    );
    return filteredProcesses;
  };

  const handleOpenArtifactModal = async (processId: string) => {
    artifactForm.openModal(processId);
    
    // Load artifacts when modal opens
    if (processId) {
      await artifactOperations.loadProcessArtifacts(
        processId,
        artifactForm.setProcessArtifacts,
        artifactForm.setLoading
      );
    }
  };

  return {
    processForm,
    processOperations,
    artifactForm,
    artifactOperations,
    handleAssociateProcess,
    handleRemoveProcess,
    handleOpenArtifactModal,
    getAvailableProcesses,
    loadAllProcesses,
    allProcesses,
    loading,
  };
}
