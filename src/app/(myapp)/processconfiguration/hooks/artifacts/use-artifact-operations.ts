import { ProcessService } from '../../services/process.service';
import { ProcessArtifact } from '@igrp/platform-process-management-types';

export function useArtifactOperations() {
  const loadProcessArtifacts = async (
    processDefinitionId: string,
    setProcessArtifacts: (artifacts: ProcessArtifact[]) => void,
    setLoading: (loading: boolean) => void,
    populateFormData?: (artifacts: ProcessArtifact[]) => void, // Add this parameter
  ) => {
    try {
      console.log('Loading process artifacts for processDefinitionId:', processDefinitionId);
      setLoading(true);
      
      // First, load the deployed artifacts (base artifacts)
      const deployedArtifacts = await ProcessService.getProcessDeployedArtifacts(processDefinitionId);
      console.log('Deployed artifacts:', deployedArtifacts);
      
      // Then, load the saved artifacts (with FormKey associations)
      const savedArtifacts = await ProcessService.getProcessArtifacts(processDefinitionId);
      console.log('Saved artifacts with FormKey:', savedArtifacts);
      
      // Merge the data: use deployed artifacts as base, but override with saved FormKey data
      const mergedArtifacts = deployedArtifacts.map(deployedArtifact => {
        const savedArtifact = savedArtifacts.find(saved => saved.key === deployedArtifact.key);
        return {
          ...deployedArtifact,
          formKey: savedArtifact?.formKey || deployedArtifact.formKey || ''
        };
      });
      
      setProcessArtifacts(mergedArtifacts || []);
      
      // Populate form data with saved FormKey values
      if (populateFormData) {
        populateFormData(mergedArtifacts || []);
      }
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
