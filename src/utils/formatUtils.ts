// Utilidades para formateo de números, monedas y texto

/**
 * Formatea un número como moneda
 * @param amount - Cantidad a formatear
 * @param currency - Código de moneda (por defecto USD)
 * @param locale - Configuración regional (por defecto es-ES)
 * @returns Cantidad formateada como moneda
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'es-ES'
): string => {
  if (isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 * @param number - Número a formatear
 * @param decimals - Número de decimales (por defecto 0)
 * @returns Número formateado
 */
export const formatNumber = (number: number, decimals: number = 0): string => {
  if (isNaN(number)) return '0';
  
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Formatea un porcentaje
 * @param value - Valor a formatear (0-100)
 * @param decimals - Número de decimales (por defecto 1)
 * @returns Porcentaje formateado
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (isNaN(value)) return '0%';
  
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena capitalizada
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palabra en una cadena
 * @param str - Cadena a formatear
 * @returns Cadena con cada palabra capitalizada
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

/**
 * Trunca un texto a una longitud específica
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @param suffix - Sufijo a agregar (por defecto '...')
 * @returns Texto truncado
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Genera iniciales de un nombre
 * @param name - Nombre completo
 * @param maxInitials - Máximo número de iniciales (por defecto 2)
 * @returns Iniciales
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Formatea un tamaño de archivo
 * @param bytes - Tamaño en bytes
 * @param decimals - Número de decimales (por defecto 2)
 * @returns Tamaño formateado
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formatea un número de teléfono
 * @param phone - Número de teléfono
 * @returns Teléfono formateado
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remover todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según la longitud
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Devolver original si no coincide con formatos conocidos
};

/**
 * Genera un color basado en una cadena (para avatares, etc.)
 * @param str - Cadena base
 * @returns Color en formato hex
 */
export const stringToColor = (str: string): string => {
  if (!str) return '#757575';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Limpia y valida un email
 * @param email - Email a limpiar
 * @returns Email limpio o cadena vacía si es inválido
 */
export const cleanEmail = (email: string): string => {
  if (!email) return '';
  
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(cleaned) ? cleaned : '';
};

/**
 * Formatea un slug para URLs
 * @param text - Texto a convertir
 * @returns Slug formateado
 */
export const createSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
};

/**
 * Resalta texto en una búsqueda
 * @param text - Texto original
 * @param searchTerm - Término a resaltar
 * @returns Texto con marcado HTML
 */
export const highlightText = (text: string, searchTerm: string): string => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Valida si una cadena es un número válido
 * @param value - Valor a validar
 * @returns true si es un número válido
 */
export const isValidNumber = (value: string | number): boolean => {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
};

/**
 * Convierte un valor a número seguro
 * @param value - Valor a convertir
 * @param defaultValue - Valor por defecto (0)
 * @returns Número válido
 */
export const toSafeNumber = (value: string | number, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
  }
  
  return defaultValue;
};