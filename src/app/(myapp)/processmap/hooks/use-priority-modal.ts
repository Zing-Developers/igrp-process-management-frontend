import { Process } from '@igrp/platform-process-management-types';
import { useState, useCallback } from 'react';

interface PriorityModalState {
  isOpen: boolean;
  process: Process | null;
  modalTitle: string;
  modalSubTitle: string;
}

export function usePriorityModal() {
  const [modalState, setModalState] = useState<PriorityModalState>({
    isOpen: false,
    process: null,
    modalTitle: 'Definir Prioridade',
    modalSubTitle: 'Selecione a prioridade para iniciar o processo',
  });

  const openModal = useCallback((process: Process) => {
    setModalState({
      isOpen: true,
      process,
      modalTitle: 'Definir Prioridade',
      modalSubTitle: `Selecione a prioridade para o processo: ${process.name}`,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
      process: null,
    }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    if (!open) {
      closeModal();
    }
  }, [closeModal]);

  return {
    priorityModal: {
      isOpen: modalState.isOpen,
      process: modalState.process,
      modalTitle: modalState.modalTitle,
      modalSubTitle: modalState.modalSubTitle,
      open: openModal,
      close: closeModal,
      setOpen,
    },
  };
}