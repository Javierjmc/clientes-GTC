import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos definidos localmente
enum UserRole {
  EMPRESARIO = 'empresario',
  ASISTENTE = 'asistente',
  ADMINISTRADOR = 'administrador'
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; company?: string; role: UserRole }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('gtc_token');
    if (token) {
      // En una implementación real, verificaríamos el token con el backend
      // Por ahora, simularemos un usuario autenticado
      const storedUser = localStorage.getItem('gtc_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // En una implementación real, haríamos una llamada a la API
      // Por ahora, simularemos una respuesta exitosa
      
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulación de usuario
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? UserRole.ADMINISTRADOR : UserRole.EMPRESARIO,
        company: email.includes('admin') ? undefined : 'Empresa Demo',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Guardar en localStorage
      localStorage.setItem('gtc_token', 'mock_jwt_token');
      localStorage.setItem('gtc_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gtc_token');
    localStorage.removeItem('gtc_user');
    setUser(null);
  };

  const register = async (userData: { name: string; email: string; password: string; company?: string; role: UserRole }) => {
    setIsLoading(true);
    try {
      // En una implementación real, haríamos una llamada a la API
      // Por ahora, simularemos una respuesta exitosa
      
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // No iniciamos sesión automáticamente después del registro
      // El usuario deberá verificar su correo primero (en una implementación real)
    } catch (error) {
      console.error('Error during registration:', error);
      throw new Error('No se pudo completar el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // En una implementación real, haríamos una llamada a la API
      // Por ahora, simularemos una respuesta exitosa
      
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error during password reset:', error);
      throw new Error('No se pudo enviar el correo de restablecimiento');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};