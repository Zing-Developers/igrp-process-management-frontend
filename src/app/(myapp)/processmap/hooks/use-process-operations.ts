import { useState, useCallback } from 'react';
import { Process, ProcessInstance } from '../../external/types/process';
import { startProcess } from '../../external/client/services/process.service';

export function useProcessOperations(igrpToast?: any) {
  const [selectedProcess, setSelectedProcess] = useState<Process | undefined>();

  const selectProcess = useCallback((process: Process) => {
    setSelectedProcess(process);
  }, []);

  const startProcessAction = useCallback(async (
    processDefinitionId: string, 
    businessKey?: string, 
    variables?: Record<string, any>
  ): Promise<ProcessInstance> => {
    try {
      const instance = await startProcess(processDefinitionId, businessKey, variables);
      return instance;
    } catch (err) {
      console.error('Error starting process:', err);
      throw err;
    }
  }, []);

  const startProcessWithToast = useCallback(async (
    processDefinitionId: string,
    processKey?: string,
    businessKey?: string, 
    variables?: Record<string, any>
  ): Promise<ProcessInstance | null> => {
    try {
      const instance = await startProcess(processDefinitionId, businessKey, variables);
      
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