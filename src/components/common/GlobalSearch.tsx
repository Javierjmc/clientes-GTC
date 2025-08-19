import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  InputAdornment,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Collapse,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/material/icons';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch, SearchEntityType, SearchResult } from '../../hooks/useGlobalSearch';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useClickOutside } from '../../hooks/useClickOutside';

/**
 * Props del componente de búsqueda global
 */
export interface GlobalSearchProps {
  placeholder?: string;
  showFilters?: boolean;
  showRecentSearches?: boolean;
  showSuggestions?: boolean;
  maxResults?: number;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
  sx?: any;
}

/**
 * Componente de búsqueda global
 */
export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = 'Buscar en toda la aplicación...',
  showFilters = true,
  showRecentSearches = true,
  showSuggestions = true,
  maxResults = 10,
  onResultClick,
  className,
  sx
}) => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const {
    query,
    results,
    isLoading,
    error,
    totalResults,
    hasMore,
    filters,
    options,
    recentSearches,
    search,
    updateFilters,
    updateOptions,
    clearSearch,
    loadMore
  } = useGlobalSearch();

  // Cerrar al hacer clic fuera
  useClickOutside(searchRef, () => setIsOpen(false));

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    search(value);
    setIsOpen(true);
  };

  // Manejar clic en resultado
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else if (result.url) {
      navigate(result.url);
    }
    setIsOpen(false);
  };

  // Manejar búsqueda reciente
  const handleRecentSearchClick = (recentQuery: string) => {
    search(recentQuery);
    setIsOpen(true);
  };

  // Limpiar búsqueda
  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
  };

  // Manejar cambio de filtros de entidad
  const handleEntityTypeChange = (entityTypes: SearchEntityType[]) => {
    updateFilters({ entityTypes });
  };

  // Opciones de tipos de entidad
  const entityTypeOptions = [
    { value: 'all', label: 'Todo' },
    { value: 'projects', label: 'Proyectos' },
    { value: 'assistants', label: 'Asistentes' },
    { value: 'users', label: 'Usuarios' },
    { value: 'tasks', label: 'Tareas' },
    { value: 'invoices', label: 'Facturas' },
    { value: 'reports', label: 'Reportes' }
  ];

  // Renderizar icono de resultado
  const renderResultIcon = (result: SearchResult) => {
    const iconName = result.icon || 'search';
    return (
      <ListItemIcon>
        <Box
          component="span"
          className="material-icons"
          sx={{ fontSize: 20, color: 'text.secondary' }}
        >
          {iconName}
        </Box>
      </ListItemIcon>
    );
  };

  // Renderizar resultado
  const renderResult = (result: SearchResult, index: number) => (
    <ListItem key={`${result.type}-${result.id}`} disablePadding>
      <ListItemButton
        onClick={() => handleResultClick(result)}
        sx={{
          py: 1,
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        {renderResultIcon(result)}
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span">
                {result.highlightedText ? (
                  <span dangerouslySetInnerHTML={{ __html: result.highlightedText }} />
                ) : (
                  result.title
                )}
              </Typography>
              <Chip
                label={entityTypeOptions.find(opt => opt.value === result.type)?.label || result.type}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            </Box>
          }
          secondary={
            <Box>
              {result.subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {result.subtitle}
                </Typography>
              )}
              {result.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 300
                  }}
                >
                  {result.description}
                </Typography>
              )}
            </Box>
          }
        />
        {result.score && (
          <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>
            {Math.round(result.score * 10) / 10}
          </Typography>
        )}
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box ref={searchRef} className={className} sx={{ position: 'relative', ...sx }}>
      {/* Campo de búsqueda */}
      <TextField
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={handleSearchChange}
        onFocus={() => setIsOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              )}
              {showFilters && (
                <IconButton
                  size="small"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  color={showAdvancedFilters ? 'primary' : 'default'}
                >
                  <Badge
                    badgeContent={filters.entityTypes.length > 1 || !filters.entityTypes.includes('all') ? filters.entityTypes.length : 0}
                    color="primary"
                    variant="dot"
                  >
                    <FilterIcon />
                  </Badge>
                </IconButton>
              )}
              {query && (
                <IconButton size="small" onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />

      {/* Filtros avanzados */}
      <Collapse in={showAdvancedFilters}>
        <Paper
          elevation={1}
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Filtros de búsqueda
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Buscar en</InputLabel>
            <Select
              multiple
              value={filters.entityTypes}
              onChange={(e) => handleEntityTypeChange(e.target.value as SearchEntityType[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={entityTypeOptions.find(opt => opt.value === value)?.label || value}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {entityTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={filters.entityTypes.includes(option.value as SearchEntityType)} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.fuzzySearch}
                  onChange={(e) => updateOptions({ fuzzySearch: e.target.checked })}
                />
              }
              label="Búsqueda difusa"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeArchived}
                  onChange={(e) => updateOptions({ includeArchived: e.target.checked })}
                />
              }
              label="Incluir archivados"
            />
          </Box>
        </Paper>
      </Collapse>

      {/* Panel de resultados */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1300,
            borderRadius: 2
          }}
        >
          {/* Error */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}

          {/* Búsquedas recientes */}
          {!query && showRecentSearches && recentSearches.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon fontSize="small" />
                  Búsquedas recientes
                </Typography>
              </Box>
              <List dense>
                {recentSearches.slice(0, 5).map((recentQuery, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleRecentSearchClick(recentQuery)}>
                      <ListItemIcon>
                        <HistoryIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText primary={recentQuery} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Resultados */}
          {query && (
            <>
              {results.length > 0 && (
                <>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <List dense>
                    {results.slice(0, maxResults).map(renderResult)}
                  </List>
                  
                  {hasMore && results.length >= maxResults && (
                    <>
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton onClick={loadMore} disabled={isLoading}>
                          <ListItemText
                            primary="Ver más resultados"
                            sx={{ textAlign: 'center' }}
                          />
                          {isLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                </>
              )}

              {results.length === 0 && !isLoading && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No se encontraron resultados para "{query}"
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Estado de carga inicial */}
          {!query && !showRecentSearches && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Escribe para buscar en toda la aplicación
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

/**
 * Hook personalizado para detectar clics fuera del componente
 */
const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
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

export default GlobalSearch;