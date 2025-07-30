import { useState, useCallback } from 'react';
import { Process } from '../../external/types/process';

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