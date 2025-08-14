import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Toolbar,
  Tooltip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { TableColumn, ActionMenuItem, SortOrder } from '../types';
import { TableSkeleton } from './LoadingSpinner';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  selectable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  title?: string;
  actions?: ActionMenuItem<T>[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRefresh?: () => void;
  onExport?: (data: T[]) => void;
  initialPageSize?: number;
  stickyHeader?: boolean;
  dense?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  selectable = false,
  searchable = true,
  filterable = false,
  exportable = false,
  refreshable = false,
  title,
  actions = [],
  onRowClick,
  onSelectionChange,
  onRefresh,
  onExport,
  initialPageSize = 10,
  stickyHeader = false,
  dense = false,
  emptyMessage = 'No hay datos disponibles'
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
  const [orderBy, setOrderBy] = useState<keyof T | ''>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  // Filtrar y ordenar datos
  const processedData = useMemo(() => {
    let filtered = data;

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = data.filter(row =>
        columns.some(column => {
          if (!column.searchable) return false;
          const value = column.accessor ? column.accessor(row) : (row as any)[column.field];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Aplicar ordenamiento
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as any)[orderBy];
        const bValue = (b as any)[orderBy];
        
        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, orderBy, order, columns]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = processedData.map(row => row.id);
      setSelected(newSelected);
      onSelectionChange?.(processedData);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleClick = (row: T) => {
    if (selectable) {
      const selectedIndex = selected.indexOf(row.id);
      let newSelected: (string | number)[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, row.id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
      const selectedRows = processedData.filter(r => newSelected.includes(r.id));
      onSelectionChange?.(selectedRows);
    } else {
      onRowClick?.(row);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionSelect = (action: ActionMenuItem<T>) => {
    if (selectedRow) {
      action.onClick(selectedRow);
    }
    handleActionClose();
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;

  if (loading) {
    return (
      <Paper sx={{ width: '100%', mb: 2 }}>
        {title && (
          <Toolbar>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        )}
        <TableSkeleton rows={rowsPerPage} columns={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {/* Toolbar */}
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          component="div"
        >
          {title}
        </Typography>
        
        {/* Búsqueda */}
        {searchable && (
          <TextField
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ mr: 1, minWidth: 200 }}
          />
        )}
        
        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {filterable && (
            <Tooltip title="Filtros">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {refreshable && (
            <Tooltip title="Actualizar">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {exportable && (
            <Tooltip title="Exportar">
              <IconButton onClick={() => onExport?.(processedData)}>
                <ExportIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>

      {/* Tabla */}
      <TableContainer>
        <Table
          stickyHeader={stickyHeader}
          size={dense ? 'small' : 'medium'}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < processedData.length}
                    checked={processedData.length > 0 && selected.length === processedData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.field ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleRequestSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              
              {actions.length > 0 && (
                <TableCell align="center" style={{ width: 60 }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isItemSelected = isSelected(row.id);
                
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: onRowClick || selectable ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => {
                      const value = column.accessor ? column.accessor(row) : (row as any)[column.field];
                      
                      return (
                        <TableCell key={String(column.field)} align={column.align || 'left'}>
                          {column.render ? column.render(value, row) : value}
                        </TableCell>
                      );
                    })}
                    
                    {actions.length > 0 && (
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, row)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={processedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleActionSelect(action)}
            disabled={action.disabled?.(selectedRow!)}
          >
            {action.icon && <Box sx={{ mr: 1, display: 'flex' }}>{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}

export default DataTable;