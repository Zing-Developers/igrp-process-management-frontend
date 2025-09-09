import { Process } from '@igrp/platform-process-management-types';
import { useState, useCallback } from 'react';

export function useProcessModal() {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalProcess, setDetailModalProcess] = useState<Process | undefined>();

  const openDetailModal = useCallback((process: Process) => {
    setDetailModalProcess(process);
    setDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setDetailModalProcess(undefined);
  }, []);

  const setDetailModalOpenState = useCallback((open: boolean) => {
    if (!open) {
      closeDetailModal();
    } else {
      setDetailModalOpen(true);
    }
  }, [closeDetailModal]);

  return {
    detailModal: {
      isOpen: detailModalOpen,
      process: detailModalProcess,
      open: openDetailModal,
      close: closeDetailModal,
      setOpen: setDetailModalOpenState, // Add this for the generated component
    },
  };
}