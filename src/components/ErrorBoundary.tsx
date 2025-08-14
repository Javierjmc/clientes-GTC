import React, { Component, ErrorInfo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Container,
  Stack
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { ErrorBoundaryState } from '../types';
// import { AppError } from '../types'; // Temporalmente comentado

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log del error
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    // Llamar al callback de error si se proporciona
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // En producción, aquí enviarías el error a un servicio como Sentry
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // AppError temporalmente comentado
    const errorData = {
      message: error.message,
      code: error.name,
      details: {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      },
      timestamp: new Date().toISOString(),
      action: 'error_boundary_catch'
    };

    // Aquí integrarías con tu servicio de logging (Sentry, LogRocket, etc.)
    console.error('Error enviado al servicio de logging:', errorData);
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Si se proporciona un componente fallback personalizado
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={this.handleReset} 
          />
        );
      }

      // Fallback por defecto
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Stack spacing={3} alignItems="center">
              <ErrorIcon 
                sx={{ 
                  fontSize: 64, 
                  color: 'error.main',
                  mb: 2 
                }} 
              />
              
              <Typography variant="h4" component="h1" gutterBottom>
                ¡Oops! Algo salió mal
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Ha ocurrido un error inesperado en la aplicación. 
                Nuestro equipo ha sido notificado automáticamente.
              </Typography>

              {this.props.showDetails && this.state.error && (
                <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                  <AlertTitle>Detalles del Error</AlertTitle>
                  <Typography variant="body2" component="pre" sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {this.state.error.message}
                    {process.env.NODE_ENV === 'development' && this.state.error.stack && (
                      `\n\nStack Trace:\n${this.state.error.stack}`
                    )}
                  </Typography>
                </Alert>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReset}
                  size="large"
                >
                  Intentar de Nuevo
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  size="large"
                >
                  Recargar Página
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  size="large"
                >
                  Ir al Inicio
                </Button>
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Si el problema persiste, contacta al soporte técnico.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook para usar con componentes funcionales
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Error capturado por useErrorHandler:', error, errorInfo);
    
    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      // AppError temporalmente comentado
      const errorData = {
        message: error.message,
        code: error.name,
        details: {
          stack: error.stack,
          ...errorInfo
        },
        timestamp: new Date().toISOString(),
        action: 'manual_error_report'
      };
      
      console.error('Error enviado al servicio de logging:', errorData);
    }
  };

  return { handleError };
};

// Componente de fallback simple para errores específicos
export const SimpleErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <Alert 
    severity="error" 
    action={
      <Button color="inherit" size="small" onClick={resetError}>
        Reintentar
      </Button>
    }
    sx={{ m: 2 }}
  >
    <AlertTitle>Error</AlertTitle>
    {error.message}
  </Alert>
);

// HOC para envolver componentes con ErrorBoundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};