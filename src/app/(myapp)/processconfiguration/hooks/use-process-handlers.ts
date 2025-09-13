import { useProcessForm } from './processes/use-process-form';
import { useProcessOperations } from './processes/use-process-operations';
import { useArtifactForm } from './artifacts/use-artifact-form';
import { useArtifactOperations } from './artifacts/use-artifact-operations';
import { useProcessNumberForm } from './sequence/use-process-number-form';
import type { ProcessNumberConfig } from '@/app/(myapp)/external/client/services/process.service';
import { useProcessNumberOperations } from './sequence/use-process-number-operations';
import { AreaProcessesMap } from '../types';
import { ProcessService } from '../services/process.service';
import { useState, useEffect } from 'react';
import {
  CreateProcessSequenceRequest,
  Process,
  ProcessData,
} from '@igrp/platform-process-management-types';
import { AreaProcessService } from '../services/area-process.service';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';

export function useProcessHandlers(
  areaProcesses: AreaProcessesMap,
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>,
  processes: Process[]
) {
  const { igrpToast } = useIGRPToast();
  const [allProcesses, setAllProcesses] = useState<Process[]>(processes);
  const [loading, setLoading] = useState(false);

  const processForm = useProcessForm();
  const processOperations = useProcessOperations(setAreaProcesses);
  const artifactForm = useArtifactForm();
  const artifactOperations = useArtifactOperations();
  const processNumberForm = useProcessNumberForm();
  const processNumberOperations = useProcessNumberOperations();

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
        artifactForm.setLoading,
        artifactForm.populateFormDataFromArtifacts, // Pass the populate function
      );
    }
  };

  const handleOpenProcessNumberModal = async (
    processId: string,
    processKey: string,
    processApplicationBase: string,
  ) => {
    console.log('processApplicationBase', processApplicationBase);
    processNumberForm.openModal(processId, processKey, processApplicationBase);

    // Load process number configurations when modal opens
    if (processId) {
      await processNumberOperations.loadProcessNumberConfigs(
        processId,
        processNumberForm.setProcessNumberConfigs,
        processNumberForm.setLoading,
        processNumberForm.populateFormDataFromConfig,
      );
    }
  };

  const handleSaveProcessNumber = async (data?: ProcessNumberConfig) => {
  
    if (!processNumberForm.modalState.selectedProcessKey) return;

    processNumberForm.setLoading(true);
    try {
      // Use data parameter if provided, otherwise use form data from state
      const formData = data || processNumberForm.formData;

      const request: CreateProcessSequenceRequest = {
        name: processNumberForm.modalState.selectedProcessKey + '_sequence',
        prefix: formData.prefix,
        dateFormat: formData.dateFormat,
        checkDigitSize: formData.checkDigit,
        padding: 0,
        numberIncrement: 1,
      };

      const savedConfig = await processNumberOperations.saveProcessNumberConfiguration(
        processNumberForm.modalState.selectedProcessKey || '',
        processNumberForm.modalState.selectedProcessApplicationBase || '',
        request
      );

      if (savedConfig) {
        processNumberForm.closeModal();
      }
    } catch (error) {
      console.error('Error saving process number configuration:', error);
    } finally {
      processNumberForm.setLoading(false);
    }
  };

  // Add a new function to handle process modal opening with preloading
  const handleOpenProcessModal = async (areaId: string) => {
    // Preload area processes if not already loaded
    if (!Array.isArray(areaProcesses[areaId])) {
      try {
        const updatedProcessesResponse = await AreaProcessService.getAreaProcesses(areaId);
        const updatedProcesses = updatedProcessesResponse.content || [];
        setAreaProcesses((prev) => ({ ...prev, [areaId]: updatedProcesses }));
      } catch (error) {
        console.error('Error loading area processes:', error);
      }
    }

    // Then open the modal
    processForm.openModal(areaId);
  };
  return {
    processForm,
    processOperations,
    artifactForm,
    artifactOperations,
    processNumberForm,
    processNumberOperations,
    handleAssociateProcess,
    handleRemoveProcess,
    handleOpenArtifactModal,
    handleOpenProcessModal,
    handleOpenProcessNumberModal,
    handleSaveProcessNumber,
    getAvailableProcesses,
    loadAllProcesses,
    allProcesses,
    loading,
  };
}
