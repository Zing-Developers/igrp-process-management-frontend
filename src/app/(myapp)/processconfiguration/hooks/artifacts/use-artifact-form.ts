import { useState } from "react";
import { ArtifactModalState } from "../../types";
import {
  ProcessArtifact,
  CreateProcessArtifactRequest,
} from "@igrp/platform-process-management-types";
import { ProcessService } from "../../services/process.service";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";

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
    console.log("Populated formData from artifacts:", newFormData);
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
    setFormData((prev) => ({
      ...prev,
      [artifactKey]: { formKey },
    }));
  };

  const saveArtifacts = async () => {
    if (!modalState.selectedProcessId) return;

    console.log(
      "Starting saveArtifacts with processId:",
      modalState.selectedProcessId,
    );
    console.log("Current formData:", formData);

    setLoading(true);
    try {
      const promises = Object.entries(formData).map(
        async ([artifactKey, data]) => {
          console.log("Processing artifact:", artifactKey, "with data:", data);

          const artifact = processArtifacts.find((a) => a.key === artifactKey);
          console.log("Found matching artifact:", artifact);

          if (artifact && data.formKey) {
            const createRequest: CreateProcessArtifactRequest = {
              name: artifact.name,
              key: artifact.key,
              formKey: data.formKey,
            };
            console.log("Sending create request:", createRequest);
            await ProcessService.createProcessArtifact(
              modalState.selectedProcessId!,
              createRequest,
            );
          }
        },
      );

      await Promise.all(promises.filter(Boolean));
      console.log("All artifacts saved successfully");

      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Artefatos salvos com sucesso!",
      });

      closeModal();
    } catch (error) {
      console.error("Error saving artifacts:", error);
      console.log("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao salvar artefatos. Tente novamente.",
      });
    } finally {
      setLoading(false);
      console.log("saveArtifacts completed");
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
