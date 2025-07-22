import { useState, useCallback } from 'react';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showSuccess = useCallback((message: string) => {
    setNotification({
      message,
      type: 'success',
      isVisible: true,
    });
  }, []);

  const showError = useCallback((message: string) => {
    setNotification({
      message,
      type: 'error',
      isVisible: true,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    hideNotification,
  };
};