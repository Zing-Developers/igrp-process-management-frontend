import { useState } from "react";
import { ProcessNumberModalState } from "../../types";
import { ProcessNumberConfig } from "@/app/(myapp)/external/client/services/process.service";
import { ProcessSequence } from "@igrp/platform-process-management-types";

export function useProcessNumberForm() {
  const [modalState, setModalState] = useState<ProcessNumberModalState>({
    isOpen: false,
    selectedProcessId: null,
    selectedProcessKey: null,
    selectedProcessApplicationBase: null,
  });

  const [processNumberConfigs, setProcessNumberConfigs] =
    useState<ProcessSequence>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProcessNumberConfig>({
    name: "",
    prefix: "",
    dateFormat: "",
    checkDigit: 0,
  });

  const openModal = (
    processId: string,
    processKey: string,
    processApplicationBase: string,
  ) => {
    setModalState({
      isOpen: true,
      selectedProcessId: processId,
      selectedProcessKey: processKey,
      selectedProcessApplicationBase: processApplicationBase,
    });
    // Reset form data when opening modal
    setFormData({
      name: "",
      prefix: "",
      dateFormat: "",
      checkDigit: 0,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedProcessId: null,
      selectedProcessKey: null,
      selectedProcessApplicationBase: null,
    });
    setProcessNumberConfigs(undefined);
    setFormData({
      name: "",
      prefix: "",
      dateFormat: "",
      checkDigit: 0,
    });
  };

  const updateFormData = (
    field: keyof ProcessNumberConfig,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const populateFormDataFromConfig = (config: ProcessSequence) => {
    setFormData({
      id: config.id,
      name: config.name,
      prefix: config.prefix,
      dateFormat: config.dateFormat,
      checkDigit: config.checkDigitSize,
    });
  };

  return {
    modalState,
    processNumberConfigs,
    setProcessNumberConfigs,
    loading,
    setLoading,
    formData,
    updateFormData,
    populateFormDataFromConfig,
    openModal,
    closeModal,
  };
}
