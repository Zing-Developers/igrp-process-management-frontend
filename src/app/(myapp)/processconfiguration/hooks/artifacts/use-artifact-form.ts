import { useState } from 'react';
import { ArtifactModalState } from '../../types';
import { ProcessArtifact } from '@igrp/platform-process-management-types';

export function useArtifactForm() {
  const [modalState, setModalState] = useState<ArtifactModalState>({
    isOpen: false,
    selectedProcessId: null,
  });

  const [processArtifacts, setProcessArtifacts] = useState<ProcessArtifact[]>([]);
  const [loading, setLoading] = useState(false);

  const openModal = (processId: string) => {
    setModalState({
      isOpen: true,
      selectedProcessId: processId,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedProcessId: null,
    });
    setProcessArtifacts([]);
  };

  return {
    modalState,
    processArtifacts,
    setProcessArtifacts,
    loading,
    setLoading,
    openModal,
    closeModal,
  };
}