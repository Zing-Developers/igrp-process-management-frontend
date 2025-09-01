import { 
  getProcessNumberConfigs, 
  saveProcessNumberConfig
} from '@/app/(myapp)/external/client/services/process.service';
import { CreateProcessSequenceRequest, ProcessSequence } from '@igrp/platform-process-management-types';

export function useProcessNumberOperations() {
  const loadProcessNumberConfigs = async (
    processId: string,
    setProcessNumberConfigs: (configs: ProcessSequence) => void,
    setLoading: (loading: boolean) => void,
    populateFormDataFromConfig?: (config: ProcessSequence) => void
  ) => {
    setLoading(true);
    try {
      const configs = await getProcessNumberConfigs(processId);
      setProcessNumberConfigs(configs);
      
      // If there's an existing config, populate the form
      if (populateFormDataFromConfig) {
        populateFormDataFromConfig(configs);
      }
    } catch (error) {
      console.error('Error loading process number configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProcessNumberConfiguration = async (
    processDefinitionId: string,
    request: CreateProcessSequenceRequest,
    igrpToast?: any
  ): Promise<ProcessSequence | null> => {
    try {
      const savedConfig = await saveProcessNumberConfig(processDefinitionId, request);
      
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Configuração de número de processo salva com sucesso!',
        });
      }
      
      return savedConfig;
    } catch (error) {
      console.error('Error saving process number configuration:', error);
      
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao salvar configuração. Tente novamente.',
        });
      }
      
      return null;
    }
  };

  return {
    loadProcessNumberConfigs,
    saveProcessNumberConfiguration
  };
}