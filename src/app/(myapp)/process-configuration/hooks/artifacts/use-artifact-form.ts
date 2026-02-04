import { useState } from "react";
import { ArtifactModalState } from "../../types";
import {
  ProcessArtifact,
  CreateProcessArtifactRequest,
} from "@igrp/platform-process-management-types";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import { createProcessArtifact } from "@/app/(myapp)/client/process";

export function useArtifactForm() {
  const { igrpToast } = useIGRPToast();
  const [modalState, setModalState] = useState<ArtifactModalState>({
    isOpen: false,
    selectedProcessId: null,
  });

  const [processArtifacts, setProcessArtifacts] = useState<ProcessArtifact[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, { formKey: string }>>(
    {},
  );

  const openModal = (processId: string) => {
    setModalState({
      isOpen: true,
      selectedProcessId: processId,
    });
    // Don't reset formData here - let it be populated by the artifacts loading
  };

  // Add a new function to populate formData from loaded artifacts
  const populateFormDataFromArtifacts = (artifacts: ProcessArtifact[]) => {
    const newFormData: Record<string, { formKey: string }> = {};
    artifacts.forEach((artifact) => {
      if (artifact.formKey) {
        newFormData[artifact.key] = { formKey: artifact.formKey };
      }
    });
    setFormData(newFormData);
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedProcessId: null,
    });
    setProcessArtifacts([]);
    setFormData({});
  };

  const updateFormData = (artifactKey: string, formKey: string) => {
    console.log(
      "Updating formData for artifact:",
      artifactKey,
      "with formKey:",
      formKey,
    );
    setFormData((prev) => ({
      ...prev,
      [artifactKey]: { formKey },
    }));
  };

  const saveArtifacts = async () => {
    if (!modalState.selectedProcessId) return;

    setLoading(true);
    try {
      const promises = Object.entries(formData).map(
        async ([artifactKey, data]) => {
          const artifact = processArtifacts.find((a) => a.key === artifactKey);

          if (artifact && data.formKey) {
            const createRequest: CreateProcessArtifactRequest = {
              name: artifact.name,
              key: artifact.key,
              formKey: data.formKey,
            };
            await createProcessArtifact(
              modalState.selectedProcessId!,
              createRequest,
            );
          }
        },
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
    processArtifacts,
    setProcessArtifacts,
    loading,
    setLoading,
    formData,
    updateFormData,
    populateFormDataFromArtifacts, // Add this new function
    saveArtifacts,
    openModal,
    closeModal,
  };
}
