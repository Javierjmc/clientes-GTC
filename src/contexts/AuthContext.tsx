import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { User, UserRole, AuthContextType } from '../types';

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
      // Simulación de una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, enviaríamos las credenciales al backend
      // y recibiríamos un token y datos del usuario
      
      // Simulamos un usuario autenticado
      const mockUser: User = {
        id: '1',
        email,
        name: 'Usuario Demo',
        role: UserRole.EMPRESARIO,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Guardamos el token y el usuario en localStorage
      localStorage.setItem('gtc_token', 'mock_token_123');
      localStorage.setItem('gtc_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
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
      // Simulación de una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, enviaríamos los datos al backend
      // y recibiríamos un token y datos del usuario
      
      // Simulamos un usuario registrado
      const mockUser: User = {
        id: '2',
        email: userData.email,
        name: userData.name,
        role: userData.role,
        company: userData.company,
        createdAt: new Date().toISOString(),
      };
      
      // Guardamos el token y el usuario en localStorage
      localStorage.setItem('gtc_token', 'mock_token_456');
      localStorage.setItem('gtc_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('No se pudo completar el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulación de una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, enviaríamos una solicitud al backend
      // para enviar un correo de recuperación de contraseña
      
      // No devolvemos nada (void)
    } catch (error) {
      throw new Error('No se pudo procesar la solicitud');
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