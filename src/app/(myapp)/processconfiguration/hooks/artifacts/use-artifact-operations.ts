import { ProcessService } from '../../services/process.service';
import { ProcessArtifact } from '@igrp/platform-process-management-types';

export function useArtifactOperations() {
  const loadProcessArtifacts = async (
    processDefinitionId: string,
    setProcessArtifacts: (artifacts: ProcessArtifact[]) => void,
    setLoading: (loading: boolean) => void,
  ) => {
    try {
      console.log('processDefinitionId deployed', processDefinitionId);
      setLoading(true);
      const response = await ProcessService.getProcessDeployedArtifacts(processDefinitionId);
      console.log('response', response);
      setProcessArtifacts(response || []);
    } catch (error) {
      console.error('Error loading process artifacts:', error);
      setProcessArtifacts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loadProcessArtifacts,
  };
}
