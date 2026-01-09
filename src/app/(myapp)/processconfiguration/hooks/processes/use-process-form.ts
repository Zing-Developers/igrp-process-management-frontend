import { useState } from "react";
import { ProcessModalState } from "../../types";

export function useProcessForm() {
  const [modalState, setModalState] = useState<ProcessModalState>({
    isOpen: false,
    selectedAreaId: null,
  });

  const openModal = (areaId: string) => {
    setModalState({
      isOpen: true,
      selectedAreaId: areaId,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedAreaId: null,
    });
  };

  return {
    modalState,
    openModal,
    closeModal,
  };
}
