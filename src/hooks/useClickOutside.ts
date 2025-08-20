import { useEffect } from 'react';

/**
 * Hook personalizado para detectar clics fuera de un elemento
 * @param ref - Referencia al elemento
 * @param handler - Función a ejecutar cuando se hace clic fuera
 */
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};

export default useClickOutside;