import { useState } from "react";
import { ArtifactModalState } from "../../types";
import {
  ProcessArtifact,
  CreateProcessArtifactRequest,
} from "@igrp/platform-process-management-types";
import { ProcessService } from "../../services/process.service";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";

export function useArtifactPermissionForm() {
  const { igrpToast } = useIGRPToast();
  const [modalState, setModalState] = useState<ArtifactModalState>({
    isOpen: false,
    selectedProcessId: null,
  });

  const [processArtifactsPermission, setProcessArtifactsPermission] = useState<
    ProcessArtifact[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Record<string, { candidateGroups: string }>
  >({});

  const openModal = (processId: string) => {
    setModalState({
      isOpen: true,
      selectedProcessId: processId,
    });
    // Don't reset formData here - let it be populated by the artifacts loading
  };

  // Add a new function to populate formData from loaded artifacts
  const populateFormDataFromArtifacts = (artifacts: ProcessArtifact[]) => {
    const newFormData: Record<string, { candidateGroups: string }> = {};
    artifacts.forEach((artifact) => {
      if (artifact.candidateGroups) {
        newFormData[artifact.key] = {
          candidateGroups: artifact.candidateGroups || "",
        };
      }
    });
    setFormData(newFormData);
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedProcessId: null,
    });
    setProcessArtifactsPermission([]);
    setFormData({});
  };

  const updateFormData = (artifactKey: string, candidateGroups: string) => {
    setFormData((prev) => ({
      ...prev,
      [artifactKey]: { candidateGroups },
    }));
  };

  const saveArtifactPermission = async () => {
    if (!modalState.selectedProcessId) return;

    setLoading(true);
    try {
      const promises = Object.entries(formData).map(
        async ([artifactKey, data]) => {
          const artifact = processArtifactsPermission.find(
            (a) => a.key === artifactKey
          );

          if (data.candidateGroups) {
            const createRequest: CreateProcessArtifactRequest = {
              key: artifactKey,
              formKey: artifact?.formKey || "",
              name: artifact?.name || "",
              candidateGroups: data.candidateGroups || "",
            };
            await ProcessService.updateProcessArtifact(
              modalState.selectedProcessId!,
              createRequest
            );
          }
        }
      );

      await Promise.all(promises.filter(Boolean));

      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Artefatos salvos com sucesso!",
      });

      closeModal();
    } catch (error) {
      console.error("Error saving artifacts:", error);
      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao salvar artefatos. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    modalState,
    processArtifactsPermission,
    setProcessArtifactsPermission,
    loading,
    setLoading,
    formData,
    updateFormData,
    populateFormDataFromArtifacts, // Add this new function
    saveArtifactPermission,
    openModal,
    closeModal,
  };
}
