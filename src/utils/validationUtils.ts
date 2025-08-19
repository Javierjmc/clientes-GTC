// Utilidades para validación de datos y formularios

/**
 * Interfaz para resultados de validación
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Valida un email
 * @param email - Email a validar
 * @returns Resultado de validación
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'El email es requerido' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'El formato del email no es válido' };
  }
  
  return { isValid: true };
};

/**
 * Valida una contraseña
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima (por defecto 8)
 * @returns Resultado de validación
 */
export const validatePassword = (password: string, minLength: number = 8): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, message: `La contraseña debe tener al menos ${minLength} caracteres` };
  }
  
  // Al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
  }
  
  // Al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
  }
  
  // Al menos un número
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número' };
  }
  
  return { isValid: true };
};

/**
 * Valida que las contraseñas coincidan
 * @param password - Contraseña original
 * @param confirmPassword - Confirmación de contraseña
 * @returns Resultado de validación
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'La confirmación de contraseña es requerida' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Las contraseñas no coinciden' };
  }
  
  return { isValid: true };
};

/**
 * Valida un nombre
 * @param name - Nombre a validar
 * @param minLength - Longitud mínima (por defecto 2)
 * @returns Resultado de validación
 */
export const validateName = (name: string, minLength: number = 2): ValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, message: 'El nombre es requerido' };
  }
  
  if (name.trim().length < minLength) {
    return { isValid: false, message: `El nombre debe tener al menos ${minLength} caracteres` };
  }
  
  // Solo letras, espacios y algunos caracteres especiales
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(name)) {
    return { isValid: false, message: 'El nombre solo puede contener letras, espacios, apostrofes y guiones' };
  }
  
  return { isValid: true };
};

/**
 * Valida un número de teléfono
 * @param phone - Teléfono a validar
 * @returns Resultado de validación
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: 'El teléfono es requerido' };
  }
  
  // Remover todos los caracteres no numéricos para validar
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10) {
    return { isValid: false, message: 'El teléfono debe tener al menos 10 dígitos' };
  }
  
  if (cleaned.length > 15) {
    return { isValid: false, message: 'El teléfono no puede tener más de 15 dígitos' };
  }
  
  return { isValid: true };
};

/**
 * Valida una URL
 * @param url - URL a validar
 * @param required - Si es requerida (por defecto false)
 * @returns Resultado de validación
 */
export const validateUrl = (url: string, required: boolean = false): ValidationResult => {
  if (!url) {
    if (required) {
      return { isValid: false, message: 'La URL es requerida' };
    }
    return { isValid: true };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'El formato de la URL no es válido' };
  }
};

/**
 * Valida un número
 * @param value - Valor a validar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Resultado de validación
 */
export const validateNumber = (
  value: string | number,
  min?: number,
  max?: number
): ValidationResult => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, message: 'Debe ser un número válido' };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, message: `El valor debe ser mayor o igual a ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, message: `El valor debe ser menor o igual a ${max}` };
  }
  
  return { isValid: true };
};

/**
 * Valida una fecha
 * @param date - Fecha a validar
 * @param minDate - Fecha mínima
 * @param maxDate - Fecha máxima
 * @returns Resultado de validación
 */
export const validateDate = (
  date: string | Date,
  minDate?: string | Date,
  maxDate?: string | Date
): ValidationResult => {
  if (!date) {
    return { isValid: false, message: 'La fecha es requerida' };
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'La fecha no es válida' };
  }
  
  if (minDate) {
    const minDateObj = typeof minDate === 'string' ? new Date(minDate) : minDate;
    if (dateObj < minDateObj) {
      return { isValid: false, message: 'La fecha es anterior a la fecha mínima permitida' };
    }
  }
  
  if (maxDate) {
    const maxDateObj = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
    if (dateObj > maxDateObj) {
      return { isValid: false, message: 'La fecha es posterior a la fecha máxima permitida' };
    }
  }
  
  return { isValid: true };
};

/**
 * Valida que un campo no esté vacío
 * @param value - Valor a validar
 * @param fieldName - Nombre del campo para el mensaje
 * @returns Resultado de validación
 */
export const validateRequired = (value: any, fieldName: string = 'Este campo'): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, message: `${fieldName} es requerido` };
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return { isValid: false, message: `${fieldName} es requerido` };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, message: `${fieldName} debe tener al menos un elemento` };
  }
  
  return { isValid: true };
};

/**
 * Valida la longitud de un texto
 * @param text - Texto a validar
 * @param minLength - Longitud mínima
 * @param maxLength - Longitud máxima
 * @returns Resultado de validación
 */
export const validateLength = (
  text: string,
  minLength?: number,
  maxLength?: number
): ValidationResult => {
  if (!text) text = '';
  
  if (minLength !== undefined && text.length < minLength) {
    return { isValid: false, message: `Debe tener al menos ${minLength} caracteres` };
  }
  
  if (maxLength !== undefined && text.length > maxLength) {
    return { isValid: false, message: `No puede tener más de ${maxLength} caracteres` };
  }
  
  return { isValid: true };
};

/**
 * Valida un archivo
 * @param file - Archivo a validar
 * @param allowedTypes - Tipos de archivo permitidos
 * @param maxSize - Tamaño máximo en bytes
 * @returns Resultado de validación
 */
export const validateFile = (
  file: File,
  allowedTypes?: string[],
  maxSize?: number
): ValidationResult => {
  if (!file) {
    return { isValid: false, message: 'Debe seleccionar un archivo' };
  }
  
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return { isValid: false, message: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}` };
  }
  
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { isValid: false, message: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB` };
  }
  
  return { isValid: true };
};

/**
 * Valida múltiples campos usando un esquema
 * @param data - Datos a validar
 * @param schema - Esquema de validación
 * @returns Objeto con errores por campo
 */
export const validateSchema = (
  data: Record<string, any>,
  schema: Record<string, (value: any) => ValidationResult>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field]);
    if (!result.isValid && result.message) {
      errors[field] = result.message;
    }
  }
  
  return errors;
};

/**
 * Verifica si hay errores en un objeto de validación
 * @param errors - Objeto de errores
 * @returns true si hay errores
 */
export const hasValidationErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Limpia errores vacíos de un objeto de validación
 * @param errors - Objeto de errores
 * @returns Objeto limpio
 */
export const cleanValidationErrors = (errors: Record<string, string>): Record<string, string> => {
  const cleaned: Record<string, string> = {};
  
  for (const [field, message] of Object.entries(errors)) {
    if (message && message.trim()) {
      cleaned[field] = message;
    }
  }
  
  return cleaned;
};