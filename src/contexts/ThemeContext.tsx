import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  actualTheme: 'light' | 'dark'; // Tema actual aplicado (considerando preferencia del sistema)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Intentar obtener el tema guardado en localStorage, o usar 'auto' por defecto
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('gtc_theme');
    return (savedTheme as ThemeMode) || 'auto';
  });

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

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('gtc_theme', mode);
    
    // Determinar el tema actual basado en el modo seleccionado
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(prefersDark ? 'dark' : 'light');
    } else {
      setActualTheme(mode as 'light' | 'dark');
    }
    
    // Aplicar clase al body para estilos globales si es necesario
    document.body.dataset.theme = actualTheme;
  }, [mode, actualTheme]);

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