import { useState } from 'react';
import { ProcessNumberModalState } from '../../types';
import { ProcessNumberConfig } from '@/app/(myapp)/external/client/services/process.service';

export function useProcessNumberForm() {
  const [modalState, setModalState] = useState<ProcessNumberModalState>({
    isOpen: false,
    selectedProcessId: null,
  });

  const [processNumberConfigs, setProcessNumberConfigs] = useState<ProcessNumberConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProcessNumberConfig>({
    name: '',
    prefix: '',
    dateFormat: '',
    checkDigit: false,
  });

  const openModal = (processId: string) => {
    setModalState({
      isOpen: true,
      selectedProcessId: processId,
    });
    // Reset form data when opening modal
    setFormData({
      name: '',
      prefix: '',
      dateFormat: '',
      checkDigit: false,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedProcessId: null,
    });
    setProcessNumberConfigs([]);
    setFormData({
      name: '',
      prefix: '',
      dateFormat: '',
      checkDigit: false,
    });
  };

  const updateFormData = (field: keyof ProcessNumberConfig, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const populateFormDataFromConfig = (config: ProcessNumberConfig) => {
    setFormData({
      id: config.id,
      name: config.name,
      prefix: config.prefix,
      dateFormat: config.dateFormat,
      checkDigit: config.checkDigit,
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