import { useState, useCallback } from 'react';

export interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm?: () => void | Promise<void>;
}

export function useAlertDialog() {
  const [alertState, setAlertState] = useState<AlertDialogState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: undefined,
  });

  const showAlert = useCallback((
    title: string,
    description: string,
    onConfirm: () => void | Promise<void>
  ) => {
    setAlertState({
      isOpen: true,
      title,
      description,
      onConfirm,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: undefined,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (alertState.onConfirm) {
      await alertState.onConfirm();
    }
    hideAlert();
  }, [alertState.onConfirm, hideAlert]);

  const handleCancel = useCallback(() => {
    hideAlert();
  }, [hideAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    handleConfirm,
    handleCancel,
  };
}