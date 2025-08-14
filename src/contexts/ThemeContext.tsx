import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, ThemeContextType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Usar hook personalizado para manejar localStorage
  const { value: mode, setValue: setMode } = useLocalStorage<ThemeMode>(
    'gtc_theme',
    'auto'
  );

  // Estado para el tema actual aplicado (considerando preferencia del sistema)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Detectar preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (mode === 'auto') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Configuración inicial
    handleChange();
    
    // Escuchar cambios en la preferencia del sistema
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Determinar el tema actual basado en el modo seleccionado
  useEffect(() => {
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(prefersDark ? 'dark' : 'light');
    } else {
      setActualTheme(mode as 'light' | 'dark');
    }
  }, [mode]);

  // Aplicar clase al body para CSS global
  useEffect(() => {
    document.body.className = actualTheme;
  }, [actualTheme]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      toggleTheme, 
      setThemeMode,
      actualTheme // Exportamos el tema actual aplicado
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};