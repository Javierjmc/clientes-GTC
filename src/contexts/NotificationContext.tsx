import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Fade,
  Grow,
  IconButton,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

/**
 * Tipos de notificación
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Posiciones de notificación
 */
export type NotificationPosition = 
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Tipos de transición
 */
export type TransitionType = 'slide' | 'fade' | 'grow';

/**
 * Interfaz para una notificación
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: number;
  timestamp: number;
}

/**
 * Opciones para mostrar notificación
 */
export interface ShowNotificationOptions {
  title?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: number;
}

/**
 * Configuración del sistema de notificaciones
 */
export interface NotificationConfig {
  position: NotificationPosition;
  transition: TransitionType;
  maxNotifications: number;
  defaultDuration: number;
  showProgress: boolean;
  allowDuplicates: boolean;
}

/**
 * Contexto de notificaciones
 */
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, options?: ShowNotificationOptions) => string;
  showSuccess: (message: string, options?: ShowNotificationOptions) => string;
  showError: (message: string, options?: ShowNotificationOptions) => string;
  showWarning: (message: string, options?: ShowNotificationOptions) => string;
  showInfo: (message: string, options?: ShowNotificationOptions) => string;
  hideNotification: (id: string) => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  config: NotificationConfig;
  updateConfig: (newConfig: Partial<NotificationConfig>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Configuración por defecto
 */
const defaultConfig: NotificationConfig = {
  position: 'top-right',
  transition: 'slide',
  maxNotifications: 5,
  defaultDuration: 5000,
  showProgress: true,
  allowDuplicates: false
};

/**
 * Componente de transición
 */
const getTransitionComponent = (type: TransitionType) => {
  switch (type) {
    case 'slide':
      return (props: TransitionProps & { children: React.ReactElement }) => (
        <Slide {...props} direction="left" />
      );
    case 'fade':
      return Fade;
    case 'grow':
      return Grow;
    default:
      return Slide;
  }
};

/**
 * Obtiene el anchorOrigin basado en la posición
 */
const getAnchorOrigin = (position: NotificationPosition) => {
  const [vertical, horizontal] = position.split('-');
  return {
    vertical: vertical as 'top' | 'bottom',
    horizontal: horizontal === 'center' ? 'center' as const : horizontal as 'left' | 'right'
  };
};

/**
 * Componente individual de notificación
 */
interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
  config: NotificationConfig;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
  config
}) => {
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(notification.duration || config.defaultDuration);

  useEffect(() => {
    if (notification.persistent) return;

    const duration = notification.duration || config.defaultDuration;
    const interval = 50; // Actualizar cada 50ms
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = ((totalSteps - currentStep) / totalSteps) * 100;
      const newTimeLeft = duration - (currentStep * interval);
      
      setProgress(Math.max(0, newProgress));
      setTimeLeft(Math.max(0, newTimeLeft));

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        onClose(notification.id);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [notification.id, notification.duration, notification.persistent, config.defaultDuration, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return null;
    }
  };

  return (
    <Alert
      severity={notification.type}
      icon={getIcon()}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {notification.action && (
            <IconButton
              size="small"
              onClick={notification.action.onClick}
              sx={{ color: 'inherit' }}
            >
              <Typography variant="caption">
                {notification.action.label}
              </Typography>
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => onClose(notification.id)}
            sx={{ color: 'inherit' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={{
        width: '100%',
        mb: 1,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {notification.title && (
        <AlertTitle>{notification.title}</AlertTitle>
      )}
      {notification.message}
      
      {/* Barra de progreso */}
      {config.showProgress && !notification.persistent && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: 'transparent'
            }
          }
        />
      )}
      
      {/* Progreso personalizado */}
      {notification.progress !== undefined && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={notification.progress}
          />
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            {Math.round(notification.progress)}% completado
          </Typography>
        </Box>
      )}
    </Alert>
  );
};

/**
 * Proveedor del contexto de notificaciones
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [config, setConfig] = useState<NotificationConfig>(defaultConfig);

  // Generar ID único
  const generateId = useCallback(() => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Mostrar notificación
  const showNotification = useCallback((
    type: NotificationType,
    message: string,
    options: ShowNotificationOptions = {}
  ): string => {
    const id = generateId();
    
    const newNotification: Notification = {
      id,
      type,
      message,
      title: options.title,
      duration: options.duration,
      persistent: options.persistent,
      action: options.action,
      progress: options.progress,
      timestamp: Date.now()
    };

    setNotifications(prev => {
      let updatedNotifications = [...prev];

      // Verificar duplicados si no están permitidos
      if (!config.allowDuplicates) {
        const isDuplicate = updatedNotifications.some(
          n => n.message === message && n.type === type
        );
        if (isDuplicate) {
          return updatedNotifications;
        }
      }

      // Agregar nueva notificación
      updatedNotifications.push(newNotification);

      // Limitar número máximo de notificaciones
      if (updatedNotifications.length > config.maxNotifications) {
        updatedNotifications = updatedNotifications.slice(-config.maxNotifications);
      }

      return updatedNotifications;
    });

    return id;
  }, [generateId, config.allowDuplicates, config.maxNotifications]);

  // Métodos de conveniencia
  const showSuccess = useCallback((message: string, options?: ShowNotificationOptions) => {
    return showNotification('success', message, options);
  }, [showNotification]);

  const showError = useCallback((message: string, options?: ShowNotificationOptions) => {
    return showNotification('error', message, options);
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: ShowNotificationOptions) => {
    return showNotification('warning', message, options);
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: ShowNotificationOptions) => {
    return showNotification('info', message, options);
  }, [showNotification]);

  // Ocultar notificación
  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Actualizar notificación
  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    );
  }, []);

  // Actualizar configuración
  const updateConfig = useCallback((newConfig: Partial<NotificationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const TransitionComponent = getTransitionComponent(config.transition);
  const anchorOrigin = getAnchorOrigin(config.position);

  const contextValue: NotificationContextType = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    clearAll,
    updateNotification,
    config,
    updateConfig
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Renderizar notificaciones */}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={anchorOrigin}
          TransitionComponent={TransitionComponent}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            // Ajustar posición para múltiples notificaciones
            transform: `translateY(${notifications.findIndex(n => n.id === notification.id) * 80}px)`
          }}
        >
          <div>
            <NotificationItem
              notification={notification}
              onClose={hideNotification}
              config={config}
            />
          </div>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

/**
 * Hook para usar el contexto de notificaciones
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

/**
 * Hook para notificaciones simples
 */
export const useSimpleNotifications = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo
  };
};

export default NotificationProvider;