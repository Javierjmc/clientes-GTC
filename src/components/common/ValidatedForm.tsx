import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { useFormValidation, FieldConfig } from '../../hooks/useFormValidation';

/**
 * Interfaz para props del formulario validado
 */
export interface ValidatedFormProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema: Record<keyof T, FieldConfig>;
  onSubmit: (values: T) => Promise<void> | void;
  children: (formState: any, formActions: any) => React.ReactNode;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  submitButtonProps?: any;
  resetButtonProps?: any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  errorMessage?: string;
  successMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  sx?: any;
}

/**
 * Componente de formulario con validación integrada
 */
export const ValidatedForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  submitButtonText = 'Enviar',
  resetButtonText = 'Resetear',
  showResetButton = false,
  submitButtonProps = {},
  resetButtonProps = {},
  validateOnChange = false,
  validateOnBlur = true,
  validateOnMount = false,
  errorMessage,
  successMessage,
  loading = false,
  disabled = false,
  className,
  sx
}: ValidatedFormProps<T>) => {
  const [formState, formActions] = useFormValidation(
    initialValues,
    validationSchema,
    {
      validateOnChange,
      validateOnBlur,
      validateOnMount
    }
  );

  const handleSubmit = formActions.handleSubmit(onSubmit);

  const isFormDisabled = disabled || loading || formState.isSubmitting;
  const canSubmit = formState.isValid && !isFormDisabled;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx
      }}
    >
      {/* Mensaje de error global */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Mensaje de éxito global */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Contenido del formulario */}
      {children(formState, formActions)}

      {/* Botones de acción */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          mt: 2
        }}
      >
        {showResetButton && (
          <Button
            type="button"
            variant="outlined"
            onClick={() => formActions.resetForm()}
            disabled={isFormDisabled || !formState.isDirty}
            {...resetButtonProps}
          >
            {resetButtonText}
          </Button>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit}
          startIcon={
            (loading || formState.isSubmitting) ? (
              <CircularProgress size={20} color="inherit" />
            ) : undefined
          }
          {...submitButtonProps}
        >
          {(loading || formState.isSubmitting) ? 'Enviando...' : submitButtonText}
        </Button>
      </Box>

      {/* Información de estado del formulario (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" component="div">
            <strong>Estado del formulario (dev):</strong>
          </Typography>
          <Typography variant="caption" component="div">
            Válido: {formState.isValid ? '✅' : '❌'} |
            Sucio: {formState.isDirty ? '✅' : '❌'} |
            Enviando: {formState.isSubmitting ? '✅' : '❌'}
          </Typography>
          {Object.keys(formState.errors).length > 0 && (
            <Typography variant="caption" component="div" color="error">
              Errores: {Object.keys(formState.errors).join(', ')}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

/**
 * Componente de campo de formulario con validación
 */
export interface ValidatedFieldProps {
  name: string;
  formActions: any;
  children: (fieldProps: any) => React.ReactNode;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
  name,
  formActions,
  children
}) => {
  const fieldProps = formActions.getFieldProps(name);
  return <>{children(fieldProps)}</>;
};

/**
 * Hook para crear un formulario validado rápidamente
 */
export const useValidatedForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, FieldConfig>,
  options?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnMount?: boolean;
  }
) => {
  return useFormValidation(initialValues, validationSchema, options);
};

export default ValidatedForm;