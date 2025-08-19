// Utilidades generales y helpers

/**
 * Genera un ID único
 * @param prefix - Prefijo opcional
 * @returns ID único
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};

/**
 * Genera un UUID v4
 * @returns UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Debounce function
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en ms
 * @returns Función debounced
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 * @param func - Función a ejecutar
 * @param limit - Límite de tiempo en ms
 * @returns Función throttled
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Copia texto al portapapeles
 * @param text - Texto a copiar
 * @returns Promise que resuelve cuando se copia
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    return false;
  }
};

/**
 * Obtiene parámetros de la URL
 * @param url - URL (opcional, usa la actual por defecto)
 * @returns Objeto con parámetros
 */
export const getUrlParams = (url?: string): Record<string, string> => {
  const urlObj = new URL(url || window.location.href);
  const params: Record<string, string> = {};
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Actualiza parámetros de la URL sin recargar la página
 * @param params - Parámetros a actualizar
 * @param replace - Si usar replaceState en lugar de pushState
 */
export const updateUrlParams = (
  params: Record<string, string | null>,
  replace: boolean = false
): void => {
  const url = new URL(window.location.href);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
};

/**
 * Detecta el tipo de dispositivo
 * @returns Tipo de dispositivo
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Detecta si es un dispositivo táctil
 * @returns true si es táctil
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Obtiene información del navegador
 * @returns Información del navegador
 */
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  
  const browsers = {
    chrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
    firefox: /Firefox/.test(ua),
    safari: /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor),
    edge: /Edg/.test(ua),
    ie: /Trident/.test(ua)
  };
  
  const browser = Object.keys(browsers).find(key => browsers[key as keyof typeof browsers]) || 'unknown';
  
  return {
    name: browser,
    userAgent: ua,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };
};

/**
 * Convierte un objeto a query string
 * @param obj - Objeto a convertir
 * @returns Query string
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)));
      } else {
        params.append(key, String(value));
      }
    }
  });
  
  return params.toString();
};

/**
 * Convierte query string a objeto
 * @param queryString - Query string
 * @returns Objeto
 */
export const queryStringToObject = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, any> = {};
  
  params.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });
  
  return obj;
};

/**
 * Scroll suave a un elemento
 * @param element - Elemento o selector
 * @param offset - Offset adicional
 */
export const scrollToElement = (
  element: string | Element,
  offset: number = 0
): void => {
  const target = typeof element === 'string' 
    ? document.querySelector(element)
    : element;
  
  if (target) {
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetTop = rect.top + scrollTop - offset;
    
    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll suave al top de la página
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Obtiene la posición de scroll
 * @returns Posición de scroll
 */
export const getScrollPosition = () => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * Verifica si un elemento está visible en el viewport
 * @param element - Elemento a verificar
 * @param threshold - Porcentaje de visibilidad requerido (0-1)
 * @returns true si está visible
 */
export const isElementVisible = (
  element: Element,
  threshold: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  if (!vertInView || !horInView) return false;
  
  if (threshold === 0) return true;
  
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = rect.height * rect.width;
  
  return (visibleArea / totalArea) >= threshold;
};

/**
 * Espera un tiempo determinado
 * @param ms - Milisegundos a esperar
 * @returns Promise que resuelve después del tiempo
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function con backoff exponencial
 * @param fn - Función a ejecutar
 * @param maxRetries - Número máximo de reintentos
 * @param baseDelay - Delay base en ms
 * @returns Promise con el resultado
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  
  throw lastError!;
};

/**
 * Formatea un número con separadores de miles
 * @param num - Número a formatear
 * @param locale - Locale a usar
 * @returns Número formateado
 */
export const formatNumber = (num: number, locale: string = 'es-ES'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Obtiene un valor anidado de un objeto usando dot notation
 * @param obj - Objeto
 * @param path - Ruta (ej: 'user.profile.name')
 * @param defaultValue - Valor por defecto
 * @returns Valor encontrado o valor por defecto
 */
export const getNestedValue = (
  obj: any,
  path: string,
  defaultValue: any = undefined
): any => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Establece un valor anidado en un objeto usando dot notation
 * @param obj - Objeto
 * @param path - Ruta (ej: 'user.profile.name')
 * @param value - Valor a establecer
 */
export const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
};

/**
 * Elimina propiedades undefined de un objeto
 * @param obj - Objeto a limpiar
 * @returns Objeto limpio
 */
export const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key as keyof T] = value;
    }
  });
  
  return cleaned;
};

/**
 * Compara dos objetos de forma superficial
 * @param obj1 - Primer objeto
 * @param obj2 - Segundo objeto
 * @returns true si son iguales
 */
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

/**
 * Obtiene un color aleatorio en formato hex
 * @returns Color hex
 */
export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Convierte hex a RGB
 * @param hex - Color en formato hex
 * @returns Objeto RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convierte RGB a hex
 * @param r - Rojo (0-255)
 * @param g - Verde (0-255)
 * @param b - Azul (0-255)
 * @returns Color hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};