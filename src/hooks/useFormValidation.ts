import { useState, useCallback, useMemo } from 'react';
import { ValidationResult, validateSchema, hasValidationErrors, cleanValidationErrors } from '../utils/validationUtils';

/**
 * Interfaz para configuración de campo
 */
export interface FieldConfig {
  validator: (value: any) => ValidationResult;
  required?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Interfaz para estado del formulario
 */
export interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Interfaz para acciones del formulario
 */
export interface FormActions<T> {
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  setTouched: (field: keyof T, touched?: boolean) => void;
  setAllTouched: () => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: (newValues?: Partial<T>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e?: React.FormEvent) => Promise<void>;
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error: boolean;
    helperText: string;
  };
}

/**
 * Hook para validación de formularios
 * @param initialValues - Valores iniciales del formulario
 * @param validationSchema - Esquema de validación
 * @param options - Opciones adicionales
 * @returns Estado y acciones del formulario
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, FieldConfig>,
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnMount?: boolean;
  } = {}
): [FormState<T>, FormActions<T>] => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    validateOnMount = false
  } = options;

  // Estado del formulario
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouchedState] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado computado
  const isValid = useMemo(() => {
    return !hasValidationErrors(errors as Record<string, string>);
  }, [errors]);

  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => values[key] !== initialValues[key]);
  }, [values, initialValues]);

  // Validar un campo específico
  const validateField = useCallback((field: keyof T): boolean => {
    const config = validationSchema[field];
    if (!config) return true;

    const value = values[field];
    const result = config.validator(value);

    if (!result.isValid && result.message) {
      setErrorsState(prev => ({ ...prev, [field]: result.message! }));
      return false;
    } else {
      setErrorsState(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  }, [values, validationSchema]);

  // Validar todo el formulario
  const validateForm = useCallback((): boolean => {
    const validators: Record<string, (value: any) => ValidationResult> = {};
    
    Object.keys(validationSchema).forEach(key => {
      validators[key as string] = validationSchema[key as keyof T].validator;
    });

    const newErrors = validateSchema(values, validators);
    const cleanedErrors = cleanValidationErrors(newErrors);
    
    setErrorsState(cleanedErrors as Record<keyof T, string>);
    
    return !hasValidationErrors(cleanedErrors);
  }, [values, validationSchema]);

  // Establecer valor de un campo
  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    // Validar en cambio si está configurado
    const config = validationSchema[field];
    if ((config?.validateOnChange ?? validateOnChange)) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateField, validationSchema, validateOnChange]);

  // Establecer múltiples valores
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  // Establecer error de un campo
  const setError = useCallback((field: keyof T, error: string) => {
    setErrorsState(prev => ({ ...prev, [field]: error }));
  }, []);

  // Establecer múltiples errores
  const setErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrorsState(prev => ({ ...prev, ...newErrors }));
  }, []);

  // Limpiar error de un campo
  const clearError = useCallback((field: keyof T) => {
    setErrorsState(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Limpiar todos los errores
  const clearErrors = useCallback(() => {
    setErrorsState({} as Record<keyof T, string>);
  }, []);

  // Marcar campo como tocado
  const setTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouchedState(prev => ({ ...prev, [field]: isTouched }));
    
    // Validar en blur si está configurado
    if (isTouched) {
      const config = validationSchema[field];
      if ((config?.validateOnBlur ?? validateOnBlur)) {
        setTimeout(() => validateField(field), 0);
      }
    }
  }, [validateField, validationSchema, validateOnBlur]);

  // Marcar todos los campos como tocados
  const setAllTouched = useCallback(() => {
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setTouchedState(allTouched);
  }, [values]);

  // Resetear formulario
  const resetForm = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues;
    setValuesState(resetValues);
    setErrorsState({} as Record<keyof T, string>);
    setTouchedState({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  // Manejar envío del formulario
  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      setAllTouched();

      try {
        const isFormValid = validateForm();
        
        if (isFormValid) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Error en envío del formulario:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateForm, setAllTouched]);

  // Obtener props para un campo
  const getFieldProps = useCallback((field: keyof T) => {
    return {
      value: values[field] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValue(field, e.target.value);
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTouched(field, true);
      },
      error: touched[field] && !!errors[field],
      helperText: touched[field] ? errors[field] || '' : ''
    };
  }, [values, errors, touched, setValue, setTouched]);

  // Validación inicial si está configurada
  useState(() => {
    if (validateOnMount) {
      validateForm();
    }
  });

  const formState: FormState<T> = {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty
  };

  const formActions: FormActions<T> = {
    setValue,
    setValues,
    setError,
    setErrors,
    clearError,
    clearErrors,
    setTouched,
    setAllTouched,
    validateField,
    validateForm,
    resetForm,
    handleSubmit,
    getFieldProps
  };

  return [formState, formActions];
};

/**
 * Hook simplificado para validación de formularios con esquema básico
 * @param initialValues - Valores iniciales
 * @param validators - Validadores por campo
 * @returns Estado y acciones del formulario
 */
export const useSimpleFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validators: Partial<Record<keyof T, (value: any) => ValidationResult>>
) => {
  const validationSchema = Object.keys(validators).reduce((schema, key) => {
    const validator = validators[key as keyof T];
    if (validator) {
      schema[key as keyof T] = {
        validator,
        validateOnBlur: true
      };
    }
    return schema;
  }, {} as Record<keyof T, FieldConfig>);

  return useFormValidation(initialValues, validationSchema);
};