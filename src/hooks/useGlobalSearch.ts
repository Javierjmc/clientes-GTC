import { useState, useCallback, useMemo, useEffect } from 'react';
import { debounce } from '../utils/generalUtils';

/**
 * Tipos de entidades que se pueden buscar
 */
export type SearchEntityType = 
  | 'projects'
  | 'assistants'
  | 'users'
  | 'tasks'
  | 'invoices'
  | 'reports'
  | 'all';

/**
 * Interfaz para resultado de búsqueda
 */
export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  icon?: string;
  metadata?: Record<string, any>;
  score?: number;
  highlightedText?: string;
}

/**
 * Interfaz para filtros de búsqueda
 */
export interface SearchFilters {
  entityTypes: SearchEntityType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  tags?: string[];
  priority?: string[];
  assignedTo?: string[];
  createdBy?: string[];
}

/**
 * Opciones de búsqueda
 */
export interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'title' | 'type';
  sortOrder?: 'asc' | 'desc';
  includeArchived?: boolean;
  fuzzySearch?: boolean;
  minScore?: number;
}

/**
 * Estado de búsqueda
 */
export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  hasMore: boolean;
  filters: SearchFilters;
  options: SearchOptions;
  recentSearches: string[];
  suggestions: string[];
}

/**
 * Datos mock para búsqueda
 */
const mockData: Record<SearchEntityType, any[]> = {
  projects: [
    {
      id: '1',
      name: 'Proyecto Alpha',
      description: 'Desarrollo de aplicación web para gestión de clientes',
      status: 'active',
      createdAt: '2024-01-15',
      tags: ['web', 'react', 'typescript']
    },
    {
      id: '2',
      name: 'Proyecto Beta',
      description: 'Sistema de facturación automatizada',
      status: 'completed',
      createdAt: '2024-02-01',
      tags: ['backend', 'api', 'billing']
    },
    {
      id: '3',
      name: 'Proyecto Gamma',
      description: 'Plataforma de análisis de datos',
      status: 'planning',
      createdAt: '2024-03-10',
      tags: ['analytics', 'dashboard', 'charts']
    }
  ],
  assistants: [
    {
      id: '1',
      name: 'Asistente de Ventas',
      description: 'Especializado en gestión de leads y seguimiento de clientes',
      type: 'sales',
      status: 'active',
      capabilities: ['lead-management', 'customer-follow-up']
    },
    {
      id: '2',
      name: 'Asistente de Soporte',
      description: 'Manejo de tickets y resolución de problemas técnicos',
      type: 'support',
      status: 'active',
      capabilities: ['ticket-management', 'technical-support']
    }
  ],
  users: [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      role: 'empresario',
      department: 'Ventas',
      status: 'active'
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      role: 'asistente',
      department: 'Soporte',
      status: 'active'
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Revisar propuesta comercial',
      description: 'Análisis detallado de la propuesta para el cliente ABC',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-12-25',
      assignedTo: 'Juan Pérez'
    },
    {
      id: '2',
      title: 'Actualizar documentación técnica',
      description: 'Revisar y actualizar la documentación del API',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-12-30',
      assignedTo: 'María García'
    }
  ],
  invoices: [
    {
      id: '1',
      number: 'INV-2024-001',
      client: 'Cliente ABC S.A.',
      amount: 15000,
      status: 'paid',
      date: '2024-12-01',
      dueDate: '2024-12-31'
    },
    {
      id: '2',
      number: 'INV-2024-002',
      client: 'Empresa XYZ Ltda.',
      amount: 8500,
      status: 'pending',
      date: '2024-12-15',
      dueDate: '2025-01-15'
    }
  ],
  reports: [
    {
      id: '1',
      title: 'Reporte de Ventas Q4 2024',
      type: 'sales',
      description: 'Análisis de ventas del último trimestre',
      createdAt: '2024-12-01',
      status: 'published'
    },
    {
      id: '2',
      title: 'Análisis de Rendimiento de Asistentes',
      type: 'performance',
      description: 'Métricas de eficiencia de asistentes IA',
      createdAt: '2024-11-15',
      status: 'draft'
    }
  ],
  all: []
};

/**
 * Función para buscar en los datos mock
 */
const searchInData = (
  query: string,
  entityTypes: SearchEntityType[],
  options: SearchOptions
): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

  const typesToSearch = entityTypes.includes('all') 
    ? Object.keys(mockData).filter(key => key !== 'all') as SearchEntityType[]
    : entityTypes;

  typesToSearch.forEach(entityType => {
    const data = mockData[entityType] || [];
    
    data.forEach(item => {
      let score = 0;
      let highlightedText = '';
      
      // Buscar en diferentes campos según el tipo de entidad
      const searchableFields = getSearchableFields(item, entityType);
      
      searchTerms.forEach(term => {
        searchableFields.forEach(({ field, value, weight = 1 }) => {
          if (value && value.toLowerCase().includes(term)) {
            score += weight;
            if (!highlightedText) {
              highlightedText = highlightText(value, term);
            }
          }
        });
      });

      if (score > 0 && (!options.minScore || score >= options.minScore)) {
        results.push({
          id: item.id,
          type: entityType,
          title: getItemTitle(item, entityType),
          subtitle: getItemSubtitle(item, entityType),
          description: getItemDescription(item, entityType),
          url: getItemUrl(item, entityType),
          icon: getItemIcon(entityType),
          metadata: item,
          score,
          highlightedText
        });
      }
    });
  });

  // Ordenar resultados
  results.sort((a, b) => {
    switch (options.sortBy) {
      case 'relevance':
        return (b.score || 0) - (a.score || 0);
      case 'title':
        return options.sortOrder === 'desc' 
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      case 'type':
        return options.sortOrder === 'desc'
          ? b.type.localeCompare(a.type)
          : a.type.localeCompare(b.type);
      default:
        return (b.score || 0) - (a.score || 0);
    }
  });

  // Aplicar límite
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  
  return results.slice(offset, offset + limit);
};

/**
 * Obtiene los campos buscables para un elemento
 */
const getSearchableFields = (item: any, entityType: SearchEntityType) => {
  const fields: Array<{ field: string; value: string; weight?: number }> = [];

  switch (entityType) {
    case 'projects':
      fields.push(
        { field: 'name', value: item.name, weight: 3 },
        { field: 'description', value: item.description, weight: 2 },
        { field: 'tags', value: item.tags?.join(' '), weight: 1 }
      );
      break;
    case 'assistants':
      fields.push(
        { field: 'name', value: item.name, weight: 3 },
        { field: 'description', value: item.description, weight: 2 },
        { field: 'type', value: item.type, weight: 1 },
        { field: 'capabilities', value: item.capabilities?.join(' '), weight: 1 }
      );
      break;
    case 'users':
      fields.push(
        { field: 'name', value: item.name, weight: 3 },
        { field: 'email', value: item.email, weight: 2 },
        { field: 'department', value: item.department, weight: 1 }
      );
      break;
    case 'tasks':
      fields.push(
        { field: 'title', value: item.title, weight: 3 },
        { field: 'description', value: item.description, weight: 2 },
        { field: 'assignedTo', value: item.assignedTo, weight: 1 }
      );
      break;
    case 'invoices':
      fields.push(
        { field: 'number', value: item.number, weight: 3 },
        { field: 'client', value: item.client, weight: 2 }
      );
      break;
    case 'reports':
      fields.push(
        { field: 'title', value: item.title, weight: 3 },
        { field: 'description', value: item.description, weight: 2 },
        { field: 'type', value: item.type, weight: 1 }
      );
      break;
  }

  return fields.filter(f => f.value);
};

/**
 * Resalta el texto de búsqueda
 */
const highlightText = (text: string, searchTerm: string): string => {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Obtiene el título del elemento
 */
const getItemTitle = (item: any, entityType: SearchEntityType): string => {
  switch (entityType) {
    case 'projects':
      return item.name;
    case 'assistants':
      return item.name;
    case 'users':
      return item.name;
    case 'tasks':
      return item.title;
    case 'invoices':
      return item.number;
    case 'reports':
      return item.title;
    default:
      return item.name || item.title || 'Sin título';
  }
};

/**
 * Obtiene el subtítulo del elemento
 */
const getItemSubtitle = (item: any, entityType: SearchEntityType): string => {
  switch (entityType) {
    case 'projects':
      return `Estado: ${item.status}`;
    case 'assistants':
      return `Tipo: ${item.type}`;
    case 'users':
      return item.email;
    case 'tasks':
      return `Asignado a: ${item.assignedTo}`;
    case 'invoices':
      return item.client;
    case 'reports':
      return `Tipo: ${item.type}`;
    default:
      return '';
  }
};

/**
 * Obtiene la descripción del elemento
 */
const getItemDescription = (item: any, entityType: SearchEntityType): string => {
  return item.description || '';
};

/**
 * Obtiene la URL del elemento
 */
const getItemUrl = (item: any, entityType: SearchEntityType): string => {
  switch (entityType) {
    case 'projects':
      return `/dashboard/projects/${item.id}`;
    case 'assistants':
      return `/dashboard/assistants/${item.id}`;
    case 'users':
      return `/admin/users/${item.id}`;
    case 'tasks':
      return `/dashboard/tasks/${item.id}`;
    case 'invoices':
      return `/dashboard/invoices/${item.id}`;
    case 'reports':
      return `/dashboard/reports/${item.id}`;
    default:
      return '#';
  }
};

/**
 * Obtiene el icono del tipo de entidad
 */
const getItemIcon = (entityType: SearchEntityType): string => {
  switch (entityType) {
    case 'projects':
      return 'folder';
    case 'assistants':
      return 'smart_toy';
    case 'users':
      return 'person';
    case 'tasks':
      return 'task';
    case 'invoices':
      return 'receipt';
    case 'reports':
      return 'assessment';
    default:
      return 'search';
  }
};

/**
 * Hook para búsqueda global
 */
export const useGlobalSearch = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    hasMore: false,
    filters: {
      entityTypes: ['all']
    },
    options: {
      limit: 20,
      sortBy: 'relevance',
      sortOrder: 'desc',
      fuzzySearch: true,
      minScore: 1
    },
    recentSearches: [],
    suggestions: []
  });

  // Función de búsqueda con debounce
  const debouncedSearch = useMemo(
    () => debounce((query: string, filters: SearchFilters, options: SearchOptions) => {
      if (!query.trim()) {
        setState(prev => ({
          ...prev,
          results: [],
          totalResults: 0,
          hasMore: false,
          isLoading: false
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const results = searchInData(query, filters.entityTypes, options);
        
        setState(prev => ({
          ...prev,
          results,
          totalResults: results.length,
          hasMore: results.length === (options.limit || 20),
          isLoading: false,
          recentSearches: [query, ...prev.recentSearches.filter(s => s !== query)].slice(0, 10)
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Error al realizar la búsqueda',
          isLoading: false
        }));
      }
    }, 300),
    []
  );

  // Realizar búsqueda
  const search = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
    debouncedSearch(query, state.filters, state.options);
  }, [debouncedSearch, state.filters, state.options]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setState(prev => {
      const updatedFilters = { ...prev.filters, ...newFilters };
      if (prev.query) {
        debouncedSearch(prev.query, updatedFilters, prev.options);
      }
      return { ...prev, filters: updatedFilters };
    });
  }, [debouncedSearch]);

  // Actualizar opciones
  const updateOptions = useCallback((newOptions: Partial<SearchOptions>) => {
    setState(prev => {
      const updatedOptions = { ...prev.options, ...newOptions };
      if (prev.query) {
        debouncedSearch(prev.query, prev.filters, updatedOptions);
      }
      return { ...prev, options: updatedOptions };
    });
  }, [debouncedSearch]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      totalResults: 0,
      hasMore: false,
      error: null
    }));
  }, []);

  // Cargar más resultados
  const loadMore = useCallback(() => {
    if (!state.hasMore || state.isLoading) return;

    const newOffset = (state.options.offset || 0) + (state.options.limit || 20);
    const newOptions = { ...state.options, offset: newOffset };
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const moreResults = searchInData(state.query, state.filters.entityTypes, newOptions);
      
      setState(prev => ({
        ...prev,
        results: [...prev.results, ...moreResults],
        hasMore: moreResults.length === (newOptions.limit || 20),
        isLoading: false,
        options: newOptions
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al cargar más resultados',
        isLoading: false
      }));
    }
  }, [state.query, state.filters.entityTypes, state.options, state.hasMore, state.isLoading]);

  return {
    ...state,
    search,
    updateFilters,
    updateOptions,
    clearSearch,
    loadMore
  };
};

export default useGlobalSearch;