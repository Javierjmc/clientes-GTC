// Utilidades para manejo y formateo de fechas

/**
 * Formatea una fecha a formato legible en español
 * @param date - Fecha a formatear (string ISO o Date)
 * @param includeTime - Si incluir la hora (por defecto false)
 * @returns Fecha formateada
 */
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  if (!date) return 'No especificada';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Mexico_City'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Formatea una fecha a formato corto (DD/MM/YYYY)
 * @param date - Fecha a formatear
 * @returns Fecha en formato corto
 */
export const formatDateShort = (date: string | Date): string => {
  if (!date) return '--';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '--';
  }
  
  return dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Calcula los días entre dos fechas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns Número de días
 */
export const daysBetween = (startDate: string | Date, endDate: string | Date): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calcula los días hasta una fecha específica
 * @param targetDate - Fecha objetivo
 * @returns Número de días (negativo si ya pasó)
 */
export const daysUntil = (targetDate: string | Date): number => {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const today = new Date();
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Verifica si una fecha está vencida
 * @param date - Fecha a verificar
 * @returns true si está vencida
 */
export const isOverdue = (date: string | Date): boolean => {
  return daysUntil(date) < 0;
};

/**
 * Formatea tiempo relativo (hace X días, en X días)
 * @param date - Fecha a comparar
 * @returns Texto relativo
 */
export const formatRelativeTime = (date: string | Date): string => {
  const days = daysUntil(date);
  
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days === -1) return 'Ayer';
  if (days > 0) return `En ${days} días`;
  return `Hace ${Math.abs(days)} días`;
};

/**
 * Convierte una fecha a formato ISO para inputs
 * @param date - Fecha a convertir
 * @returns Fecha en formato YYYY-MM-DD
 */
export const toInputDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Obtiene el inicio del día para una fecha
 * @param date - Fecha
 * @returns Fecha al inicio del día
 */
export const startOfDay = (date: string | Date): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Obtiene el final del día para una fecha
 * @param date - Fecha
 * @returns Fecha al final del día
 */
export const endOfDay = (date: string | Date): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Formatea duración en horas a texto legible
 * @param hours - Número de horas
 * @returns Texto formateado
 */
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  
  if (hours < 24) {
    return `${hours.toFixed(1)} h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days} día${days > 1 ? 's' : ''}`;
  }
  
  return `${days}d ${remainingHours.toFixed(1)}h`;
};

/**
 * Obtiene el rango de fechas de la semana actual
 * @returns Objeto con inicio y fin de semana
 */
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Obtiene el rango de fechas del mes actual
 * @returns Objeto con inicio y fin de mes
 */
export const getCurrentMonthRange = (): { start: Date; end: Date } => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return { start, end };
};