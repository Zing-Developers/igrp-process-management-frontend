import {
  getProcessArtifacts,
  getProcessDeployedArtifacts,
} from "@/app/(myapp)/client/process";
import { ProcessArtifact } from "@igrp/platform-process-management-types";

export function useArtifactOperations() {
  const loadProcessArtifacts = async (
    processDefinitionId: string,
    setProcessArtifacts: (artifacts: ProcessArtifact[]) => void,
    setLoading: (loading: boolean) => void,
    populateFormData?: (artifacts: ProcessArtifact[]) => void, // Add this parameter
  ) => {
    try {
      setLoading(true);

      // First, load the deployed artifacts (base artifacts)
      const deployedArtifacts =
        await getProcessDeployedArtifacts(processDefinitionId);

      // Then, load the saved artifacts (with FormKey associations)
      const savedArtifacts = await getProcessArtifacts(processDefinitionId);

      // Merge the data: use deployed artifacts as base, but override with saved FormKey data
      const mergedArtifacts = deployedArtifacts.map((deployedArtifact) => {
        const savedArtifact = savedArtifacts.find(
          (saved) => saved.key === deployedArtifact.key,
        );
        const candidateGroupsValue =
          (savedArtifact as any)?.candidateGroups ||
          (deployedArtifact as any).candidateGroups;
        const candidateGroupsString = candidateGroupsValue
          ? Array.isArray(candidateGroupsValue)
            ? candidateGroupsValue.join(",")
            : String(candidateGroupsValue)
          : "";
        return {
          ...deployedArtifact,
          formKey: savedArtifact?.formKey || deployedArtifact.formKey || "",
          candidateGroups: candidateGroupsString,
        };
      });

      setProcessArtifacts(mergedArtifacts || []);

      // Populate form data with saved FormKey values
      populateFormData?.(mergedArtifacts || []);
    } catch (error) {
      console.error("Error loading process artifacts:", error);
      setProcessArtifacts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loadProcessArtifacts,
  };
}
