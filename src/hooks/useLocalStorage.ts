import { useState, useEffect, useCallback } from 'react';
import { UseLocalStorageReturn } from '../types';

/**
 * Hook personalizado para manejar localStorage de manera reactiva
 * Sincroniza automáticamente con localStorage y maneja errores
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    onError?: (error: Error) => void;
  }
): UseLocalStorageReturn<T> {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError = console.error
  } = options || {};

  // Función para leer del localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Error leyendo localStorage'));
      return initialValue;
    }
  }, [key, initialValue, deserialize, onError]);

  // Estado inicial
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Función para escribir al localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn('localStorage no está disponible');
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        
        // Guardar en localStorage
        window.localStorage.setItem(key, serialize(newValue));
        
        // Actualizar estado
        setStoredValue(newValue);
        
        // Disparar evento personalizado para sincronizar entre pestañas
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: {
              key,
              newValue
            }
          })
        );
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Error escribiendo a localStorage'));
      }
    },
    [key, serialize, storedValue, onError]
  );

  // Función para remover del localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn('localStorage no está disponible');
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      // Disparar evento personalizado
      window.dispatchEvent(
        new CustomEvent('local-storage', {
          detail: {
            key,
            newValue: initialValue
          }
        })
      );
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Error removiendo de localStorage'));
    }
  }, [key, initialValue, onError]);

  // Escuchar cambios en localStorage (para sincronizar entre pestañas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key !== key) return;
      
      if ('detail' in e && e.detail.key !== key) return;

      setStoredValue(readValue());
    };

    // Escuchar eventos nativos de storage
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar eventos personalizados (para la misma pestaña)
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key, readValue]);

  return {
    value: storedValue,
    setValue,
    removeValue
  };
}

/**
 * Hook específico para manejar configuraciones de usuario
 */
export function useUserSettings<T extends Record<string, any>>(
  defaultSettings: T
) {
  const { value: settings, setValue: setSettings, removeValue } = useLocalStorage(
    'gtc_user_settings',
    defaultSettings
  );

  const updateSetting = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    },
    [setSettings]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<T>) => {
      setSettings(prev => ({
        ...prev,
        ...newSettings
      }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings, defaultSettings]);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    removeSettings: removeValue
  };
}

/**
 * Hook para manejar el historial de búsquedas
 */
export function useSearchHistory(maxItems = 10) {
  const { value: history, setValue: setHistory } = useLocalStorage<string[]>(
    'gtc_search_history',
    []
  );

  const addSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) return;
      
      setHistory(prev => {
        const filtered = prev.filter(item => item !== searchTerm);
        const newHistory = [searchTerm, ...filtered];
        return newHistory.slice(0, maxItems);
      });
    },
    [setHistory, maxItems]
  );

  const removeSearch = useCallback(
    (searchTerm: string) => {
      setHistory(prev => prev.filter(item => item !== searchTerm));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory
  };
}

/**
 * Hook para manejar preferencias de tabla (ordenamiento, filtros, etc.)
 */
export function useTablePreferences(tableId: string) {
  const key = `gtc_table_${tableId}`;
  
  const { value: preferences, setValue: setPreferences } = useLocalStorage(
    key,
    {
      sortBy: '',
      sortOrder: 'asc' as 'asc' | 'desc',
      filters: {} as Record<string, any>,
      pageSize: 10,
      hiddenColumns: [] as string[]
    }
  );

  const updateSort = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') => {
      setPreferences(prev => ({
        ...prev,
        sortBy,
        sortOrder
      }));
    },
    [setPreferences]
  );

  const updateFilters = useCallback(
    (filters: Record<string, any>) => {
      setPreferences(prev => ({
        ...prev,
        filters
      }));
    },
    [setPreferences]
  );

  const updatePageSize = useCallback(
    (pageSize: number) => {
      setPreferences(prev => ({
        ...prev,
        pageSize
      }));
    },
    [setPreferences]
  );

  const toggleColumn = useCallback(
    (columnId: string) => {
      setPreferences(prev => ({
        ...prev,
        hiddenColumns: prev.hiddenColumns.includes(columnId)
          ? prev.hiddenColumns.filter(id => id !== columnId)
          : [...prev.hiddenColumns, columnId]
      }));
    },
    [setPreferences]
  );

  return {
    preferences,
    updateSort,
    updateFilters,
    updatePageSize,
    toggleColumn
  };
}