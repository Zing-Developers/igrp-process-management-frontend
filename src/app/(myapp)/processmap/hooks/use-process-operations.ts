import { useState, useCallback } from 'react';
import { startProcess } from '../../external/client/services/process.service';
import { Process, ProcessInstance } from '@igrp/platform-process-management-types';

export function useProcessOperations(igrpToast?: any) {
  const [selectedProcess, setSelectedProcess] = useState<Process | undefined>();

  const selectProcess = useCallback((process: Process) => {
    setSelectedProcess(process);
  }, []);

  const startProcessAction = useCallback(async (
    processDefinitionId: string, 
    processKey: string,
    businessKey?: string, 
    variables?: Array<{ name: string; value: string }>
  ): Promise<ProcessInstance> => {
    try {
      const instance = await startProcess(processDefinitionId, processKey, businessKey, variables);
      return instance;
    } catch (err) {
      console.error('Error starting process:', err);
      throw err;
    }
  }, []);

  const startProcessWithToast = useCallback(async (
    processDefinitionId: string, 
    processKey: string,
    businessKey?: string, 
    variables?: Array<{ name: string; value: string }>
  ): Promise<ProcessInstance | null> => {
    try {
      const instance = await startProcess(processDefinitionId, processKey, businessKey, variables);
      
      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Processo Iniciado',
          description: processKey 
            ? `O processo ${processKey} foi iniciado com sucesso.`
            : 'O processo foi iniciado com sucesso.',
        });
      }
      
      return instance;
    } catch (err) {
      console.error('Error starting process:', err);
      
      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro ao Iniciar Processo',
          description: 'Ocorreu um erro ao tentar iniciar o processo.',
        });
      }
      
      return null;
    }
  }, [igrpToast]);

  return {
    selectedProcess,
    selectProcess,
    startProcess: startProcessAction,
    startProcessWithToast,
  };
}