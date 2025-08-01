import axios from 'axios';

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

interface Project {
  id: string;
  name: string;
  description: string;
  clientId?: string;
  assistantId?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  progress?: number;
  deadline?: Date;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  clientId: string;
  number: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  notes?: string;
}

interface VirtualAssistant {
  id: string;
  name: string;
  email: string;
  specialty: string;
  skills: string[];
  assignedTo?: string;
  assignedToName?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface MonthlyReport {
  id: string;
  assistantId: string;
  clientId: string;
  month: number;
  year: number;
  totalHours: number;
  completedTasks: number;
  summary: string;
  highlights?: string;
  challenges?: string;
  nextSteps?: string;
  createdAt: string;
  fileUrl?: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || 'https://api.globaltalentconnections.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gtc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (Unauthorized), redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gtc_token');
      localStorage.removeItem('gtc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: Partial<User>) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  resetPassword: async (email: string) => {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },
  changePassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { token, newPassword });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Servicios para proyectos
export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data as Project[];
  },
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data as Project;
  },
  create: async (project: Partial<Project>) => {
    const response = await api.post('/projects', project);
    return response.data;
  },
  update: async (id: string, project: Partial<Project>) => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Servicios para tareas
export const taskService = {
  getAll: async (projectId?: string) => {
    const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
    const response = await api.get(url);
    return response.data as Task[];
  },
  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data as Task;
  },
  create: async (task: Partial<Task>) => {
    const response = await api.post('/tasks', task);
    return response.data;
  },
  update: async (id: string, task: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Servicios para asistentes virtuales
export const assistantService = {
  getAll: async () => {
    const response = await api.get('/assistants');
    return response.data as VirtualAssistant[];
  },
  getById: async (id: string) => {
    const response = await api.get(`/assistants/${id}`);
    return response.data as VirtualAssistant;
  },
  create: async (assistant: Partial<VirtualAssistant>) => {
    const response = await api.post('/assistants', assistant);
    return response.data;
  },
  update: async (id: string, assistant: Partial<VirtualAssistant>) => {
    const response = await api.put(`/assistants/${id}`, assistant);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/assistants/${id}`);
    return response.data;
  },
};

// Servicios para facturas
export const invoiceService = {
  getAll: async () => {
    const response = await api.get('/invoices');
    return response.data as Invoice[];
  },
  getById: async (id: string) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data as Invoice;
  },
  create: async (invoice: Partial<Invoice>) => {
    const response = await api.post('/invoices', invoice);
    return response.data;
  },
  update: async (id: string, invoice: Partial<Invoice>) => {
    const response = await api.put(`/invoices/${id}`, invoice);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },
  markAsPaid: async (id: string) => {
    const response = await api.put(`/invoices/${id}/pay`);
    return response.data;
  },
};

// Servicios para informes mensuales
export const reportService = {
  getAll: async () => {
    const response = await api.get('/reports');
    return response.data as MonthlyReport[];
  },
  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data as MonthlyReport;
  },
  create: async (report: Partial<MonthlyReport>) => {
    const response = await api.post('/reports', report);
    return response.data;
  },
  update: async (id: string, report: Partial<MonthlyReport>) => {
    const response = await api.put(`/reports/${id}`, report);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};

// Servicios para notificaciones
export const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data as Notification[];
  },
  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Servicios para usuarios (admin)
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data as User[];
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data as User;
  },
  create: async (user: Partial<User>) => {
    const response = await api.post('/users', user);
    return response.data;
  },
  update: async (id: string, user: Partial<User>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;