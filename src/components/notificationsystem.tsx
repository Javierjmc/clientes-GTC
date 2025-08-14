import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  SlideProps,
  IconButton,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
// import { AppError } from '../types'; // Temporalmente comentado

type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  title?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showErrorFromException: (error: Error) => void; // AppError temporalmente removido
  hideNotification: (id: string) => void;
  hideAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  maxNotifications = 5 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.persistent ? undefined : 6000)
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    // Auto-hide si no es persistente
    if (!notification.persistent && newNotification.duration) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }
  }, [generateId, maxNotifications]);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const hideAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showNotification({ message, severity: 'success', title });
  }, [showNotification]);

  const showError = useCallback((message: string, title?: string) => {
    showNotification({ message, severity: 'error', title, persistent: true });
  }, [showNotification]);

  const showWarning = useCallback((message: string, title?: string) => {
    showNotification({ message, severity: 'warning', title });
  }, [showNotification]);

  const showInfo = useCallback((message: string, title?: string) => {
    showNotification({ message, severity: 'info', title });
  }, [showNotification]);

  const showErrorFromException = useCallback((error: Error) => {
    // Simplificado para manejar solo Error
    showNotification({
      message: error.message || 'Ha ocurrido un error inesperado',
      severity: 'error',
      title: 'Error',
      persistent: true
    });
  }, [showNotification]);

  const contextValue: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showErrorFromException,
    hideNotification,
    hideAllNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Renderizar notificaciones */}
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
          width: '100%'
        }}
      >
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open={true}
            TransitionComponent={SlideTransition}
            sx={{ position: 'relative', mb: 1 }}
          >
            <Alert
              severity={notification.severity}
              variant="filled"
              sx={{ width: '100%' }}
              action={
                <Box display="flex" alignItems="center" gap={1}>
                  {notification.action && (
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={notification.action.onClick}
                      sx={{ mr: 1 }}
                    >
                      {notification.action.label}
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => hideNotification(notification.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              {notification.title && (
                <AlertTitle>{notification.title}</AlertTitle>
              )}
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </NotificationContext.Provider>
  );
};

// Hook simplificado para toast
export const useToast = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo
  };
};

// Hook para manejo de errores de API
export const useApiErrorHandler = () => {
  const { showErrorFromException } = useNotifications();
  
  return {
    handleError: showErrorFromException
  };
};

export default NotificationProvider;