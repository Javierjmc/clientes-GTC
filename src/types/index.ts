// Tipos centralizados para toda la aplicación

// Enums
export enum UserRole {
  EMPRESARIO = 'empresario',
  ASISTENTE = 'asistente',
  ADMINISTRADOR = 'administrador'
}

export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum AssistantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// Interfaces principales
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId?: string;
  assistantId?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  progress?: number;
  deadline?: string;
  budget?: number;
  currency?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  actualHours?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName?: string;
  number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  notes?: string;
  taxAmount?: number;
  discountAmount?: number;
  subtotal?: number;
}

export interface VirtualAssistant {
  id: string;
  name: string;
  email: string;
  specialty: string;
  skills: string[];
  assignedTo?: string;
  assignedToName?: string;
  status: AssistantStatus;
  createdAt: string;
  avatarUrl?: string;
  hourlyRate?: number;
  bio?: string;
  languages?: string[];
  timezone?: string;
}

export interface MonthlyReport {
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
  revenue?: number;
  efficiency?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
  actionRequired?: boolean;
  expiresAt?: string;
}

// Interfaces para contextos
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  actualTheme: 'light' | 'dark';
}

// Interfaces para formularios
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  clientId?: string;
  assistantId?: string;
  deadline?: string;
  budget?: number;
  currency?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  dueDate?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
}

// Interfaces para configuraciones
export interface GeneralSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  theme: ThemeMode;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectUpdates: boolean;
  invoiceReminders: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginNotifications: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
  dataRetention: number;
}

export interface IntegrationSettings {
  googleCalendar: boolean;
  slack: boolean;
  trello: boolean;
  zapier: boolean;
}

// Tipos de utilidad
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SortOrder = 'asc' | 'desc';

export type FilterOptions = {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

// Tipos para componentes
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning';
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingInvoices: number;
  totalRevenue: number;
  activeAssistants: number;
  monthlyGrowth: number;
  efficiency: number;
}

// Tipos para errores
export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  userId?: string;
  action?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Tipos para hooks personalizados
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// Re-exportar tipos comunes de React para conveniencia
export type { ReactNode, ComponentType, FC } from 'react';
export type { RouteProps } from 'react-router-dom';