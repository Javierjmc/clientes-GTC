import { useState, useCallback, useEffect } from 'react';
import { UseAsyncState } from '../types';
import { useErrorHandler } from '../components/ErrorBoundary';

/**
 * Hook personalizado para manejar operaciones asíncronas
 * Proporciona estados de loading, error y data de manera consistente
 */
export function useAsync<T>(
  asyncFunction?: (...args: any[]) => Promise<T>,
  immediate = false,
  deps: any[] = []
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(
    async (...args: any[]) => {
      if (!asyncFunction) return;

      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        handleError(err instanceof Error ? err : new Error(errorMessage));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, handleError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  // Ejecutar inmediatamente si se especifica
  useEffect(() => {
    if (immediate && asyncFunction) {
      execute();
    }
  }, [immediate, execute, ...deps]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

/**
 * Hook específico para operaciones de fetch de datos
 */
export function useFetch<T>(
  url: string | null,
  options?: RequestInit,
  immediate = true
): UseAsyncState<T> {
  const fetchFunction = useCallback(async () => {
    if (!url) throw new Error('URL no proporcionada');
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }, [url, options]);

  return useAsync<T>(url ? fetchFunction : undefined, immediate, [url]);
}

/**
 * Hook para manejar mutaciones (POST, PUT, DELETE)
 */
export function useMutation<T, TVariables = any>(
  mutationFunction: (variables: TVariables) => Promise<T>,
  options?: {
    onSuccess?: (data: T, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (data: T | null, error: Error | null, variables: TVariables) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const mutate = useCallback(
    async (variables: TVariables) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await mutationFunction(variables);
        setData(result);
        
        options?.onSuccess?.(result, variables);
        options?.onSettled?.(result, null, variables);
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido');
        const errorMessage = error.message;
        
        setError(errorMessage);
        handleError(error);
        
        options?.onError?.(error, variables);
        options?.onSettled?.(null, error, variables);
        
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutationFunction, options, handleError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset
  };
}

/**
 * Hook para manejar múltiples requests en paralelo
 */
export function useAsyncParallel<T extends readonly unknown[]>(
  asyncFunctions: readonly [...{ [K in keyof T]: () => Promise<T[K]> }],
  immediate = false
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await Promise.all(
        asyncFunctions.map(fn => fn())
      ) as T;
      
      setData(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunctions, handleError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

/**
 * Hook para retry automático con backoff exponencial
 */
export function useAsyncWithRetry<T>(
  asyncFunction: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  immediate = false
) {
  const [retryCount, setRetryCount] = useState(0);
  
  const asyncWithRetry = useCallback(async () => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFunction();
        setRetryCount(0); // Reset en caso de éxito
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Error desconocido');
        setRetryCount(attempt + 1);
        
        if (attempt < maxRetries) {
          // Backoff exponencial: baseDelay * 2^attempt
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }, [asyncFunction, maxRetries, baseDelay]);

  const asyncState = useAsync(asyncWithRetry, immediate);

  return {
    ...asyncState,
    retryCount,
    maxRetries
  };
}