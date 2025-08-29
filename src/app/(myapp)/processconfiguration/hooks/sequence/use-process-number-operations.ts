import { 
  getProcessNumberConfigs, 
  saveProcessNumberConfig, 
  deleteProcessNumberConfig,
  ProcessNumberConfig 
} from '@/app/(myapp)/external/client/services/process.service';

export function useProcessNumberOperations() {
  const loadProcessNumberConfigs = async (
    processId: string,
    setProcessNumberConfigs: (configs: ProcessNumberConfig[]) => void,
    setLoading: (loading: boolean) => void,
    populateFormDataFromConfig?: (config: ProcessNumberConfig) => void
  ) => {
    setLoading(true);
    try {
      const configs = await getProcessNumberConfigs();
      setProcessNumberConfigs(configs);
      
      // If there's an existing config, populate the form
      if (configs.length > 0 && populateFormDataFromConfig) {
        populateFormDataFromConfig(configs[0]);
      }
    } catch (error) {
      console.error('Error loading process number configurations:', error);
      setProcessNumberConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProcessNumberConfiguration = async (
    config: ProcessNumberConfig,
    igrpToast?: any
  ): Promise<ProcessNumberConfig | null> => {
    try {
      const savedConfig = await saveProcessNumberConfig(config);
      
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

  const deleteProcessNumberConfiguration = async (
    configId: string,
    igrpToast?: any
  ): Promise<boolean> => {
    try {
      await deleteProcessNumberConfig(configId);
      
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Configuração removida com sucesso!',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting process number configuration:', error);
      
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao remover configuração. Tente novamente.',
        });
      }
      
      return false;
    }
  };

  return {
    loadProcessNumberConfigs,
    saveProcessNumberConfiguration,
    deleteProcessNumberConfiguration,
  };
}