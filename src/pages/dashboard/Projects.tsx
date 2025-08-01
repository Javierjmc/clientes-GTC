import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import { Grid } from '../../components/GridFix';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assignment as ProjectIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos locales
interface Project {
  id: string;
  name: string;
  description: string;
  clientId?: string;
  assistantId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget?: number;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface VirtualAssistant {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: number;
  availability: 'Completa' | 'Parcial' | 'No disponible';
  avatarUrl?: string;
}

// Datos de ejemplo
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Desarrollo Web Corporativo',
    description: 'Desarrollo completo de sitio web corporativo con panel de administración',
    status: 'in_progress',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    budget: 5000,
    progress: 65,
    priority: 'high',
    tags: ['Web', 'React', 'Backend'],
    assistantId: '1',
    clientId: 'client1'
  },
  {
    id: '2',
    name: 'Gestión de Redes Sociales',
    description: 'Administración completa de perfiles en redes sociales y creación de contenido',
    status: 'in_progress',
    startDate: '2023-09-15',
    endDate: '2023-11-30',
    budget: 2000,
    progress: 40,
    priority: 'medium',
    tags: ['Social Media', 'Marketing', 'Contenido'],
    assistantId: '2',
    clientId: 'client2'
  },
  {
    id: '3',
    name: 'Investigación de Mercado',
    description: 'Análisis exhaustivo de competencia y oportunidades de mercado',
    status: 'pending',
    startDate: '2023-11-01',
    endDate: '2023-12-15',
    budget: 1500,
    progress: 10,
    priority: 'medium',
    tags: ['Investigación', 'Análisis', 'Mercado'],
    assistantId: '3',
    clientId: 'client3'
  },
  {
    id: '4',
    name: 'Automatización de Procesos',
    description: 'Implementación de herramientas de automatización para optimizar workflows',
    status: 'completed',
    startDate: '2023-08-01',
    endDate: '2023-09-30',
    budget: 3000,
    progress: 100,
    priority: 'high',
    tags: ['Automatización', 'Procesos', 'Eficiencia'],
    assistantId: '1',
    clientId: 'client1'
  }
];

const mockAssistants: VirtualAssistant[] = [
  { id: '1', name: 'Ana García', email: 'ana@example.com', skills: ['Desarrollo Web', 'SEO', 'Copywriting'], hourlyRate: 15, availability: 'Completa' },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@example.com', skills: ['Redes Sociales', 'Diseño Gráfico'], hourlyRate: 12, availability: 'Parcial' },
  { id: '3', name: 'María López', email: 'maria@example.com', skills: ['Investigación', 'Análisis de Datos'], hourlyRate: 14, availability: 'Completa' }
];

const statusColors = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'error'
} as const;

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado'
};

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error'
} as const;

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
};

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [assistants] = useState<VirtualAssistant[]>(mockAssistants);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para alertas
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar proyectos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Obtener proyectos paginados
  const paginatedProjects = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCreateProject = () => {
    setEditingProject({
      name: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      tags: [],
      progress: 0
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setOpenDeleteDialog(true);
  };

  const handleSaveProject = () => {
    if (!editingProject.name || !editingProject.description) {
      setAlert({ type: 'error', message: 'Por favor completa todos los campos requeridos' });
      return;
    }

    if (isEditing) {
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id ? { ...editingProject as Project } : p
      ));
      setAlert({ type: 'success', message: 'Proyecto actualizado exitosamente' });
    } else {
      const newProject: Project = {
        ...editingProject as Project,
        id: Date.now().toString(),
        startDate: new Date().toISOString().split('T')[0]
      };
      setProjects(prev => [...prev, newProject]);
      setAlert({ type: 'success', message: 'Proyecto creado exitosamente' });
    }

    setOpenDialog(false);
    setEditingProject({});
  };

  const confirmDeleteProject = () => {
    if (selectedProject) {
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      setAlert({ type: 'success', message: 'Proyecto eliminado exitosamente' });
      setOpenDeleteDialog(false);
      setSelectedProject(null);
    }
  };

  const getAssistantName = (assistantId?: string) => {
    const assistant = assistants.find(a => a.id === assistantId);
    return assistant ? assistant.name : 'Sin asignar';
  };

  const renderProjectCard = (project: Project) => (
    <Grid item xs={12} sm={6} md={4} key={project.id}>
      <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {project.name}
            </Typography>
            <Chip 
              label={priorityLabels[project.priority]} 
              color={priorityColors[project.priority]}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {project.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={statusLabels[project.status]} 
              color={statusColors[project.status]}
              size="small"
              sx={{ mr: 1 }}
            />
            {project.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progreso: {project.progress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={project.progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {getAssistantName(project.assistantId)}
            </Typography>
          </Box>
          
          {project.budget && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                ${project.budget.toLocaleString()}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(project.startDate).toLocaleDateString()}
              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions>
          <Tooltip title="Ver detalles">
            <IconButton size="small" color="primary">
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" color="primary" onClick={() => handleEditProject(project)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={() => handleDeleteProject(project)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderProjectTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Asistente</TableCell>
            <TableCell>Progreso</TableCell>
            <TableCell>Presupuesto</TableCell>
            <TableCell>Fecha Inicio</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProjects.map((project) => (
            <TableRow key={project.id} hover>
              <TableCell>
                <Typography variant="subtitle2">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description.substring(0, 50)}...
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={statusLabels[project.status]} 
                  color={statusColors[project.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={priorityLabels[project.priority]} 
                  color={priorityColors[project.priority]}
                  size="small"
                />
              </TableCell>
              <TableCell>{getAssistantName(project.assistantId)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ width: 60, mr: 1 }}
                  />
                  <Typography variant="body2">{project.progress}%</Typography>
                </Box>
              </TableCell>
              <TableCell>
                {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
              </TableCell>
              <TableCell>
                {new Date(project.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Tooltip title="Ver detalles">
                  <IconButton size="small" color="primary">
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton size="small" color="primary" onClick={() => handleEditProject(project)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton size="small" color="error" onClick={() => handleDeleteProject(project)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredProjects.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página:"
      />
    </TableContainer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Cargando proyectos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Proyectos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra todos tus proyectos y su progreso
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
          size="large"
        >
          Nuevo Proyecto
        </Button>
      </Box>

      {/* Alertas */}
      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="in_progress">En Progreso</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={priorityFilter}
                label="Prioridad"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="low">Baja</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => {
                setTabValue(newValue);
                setViewMode(newValue === 0 ? 'cards' : 'table');
              }}
              variant="fullWidth"
            >
              <Tab label="Tarjetas" />
              <Tab label="Tabla" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de proyectos */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {filteredProjects.map(renderProjectCard)}
        </Grid>
      ) : (
        renderProjectTable()
      )}

      {/* FAB para crear proyecto */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateProject}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo para crear/editar proyecto */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Proyecto"
                value={editingProject.name || ''}
                onChange={(e) => setEditingProject(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={editingProject.status || 'pending'}
                  label="Estado"
                  onChange={(e) => setEditingProject(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                >
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="in_progress">En Progreso</MenuItem>
                  <MenuItem value="completed">Completado</MenuItem>
                  <MenuItem value="cancelled">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={editingProject.priority || 'medium'}
                  label="Prioridad"
                  onChange={(e) => setEditingProject(prev => ({ ...prev, priority: e.target.value as Project['priority'] }))}
                >
                  <MenuItem value="low">Baja</MenuItem>
                  <MenuItem value="medium">Media</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Asistente</InputLabel>
                <Select
                  value={editingProject.assistantId || ''}
                  label="Asistente"
                  onChange={(e) => setEditingProject(prev => ({ ...prev, assistantId: e.target.value }))}
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {assistants.map((assistant) => (
                    <MenuItem key={assistant.id} value={assistant.id}>
                      {assistant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Presupuesto"
                type="number"
                value={editingProject.budget || ''}
                onChange={(e) => setEditingProject(prev => ({ ...prev, budget: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                value={editingProject.startDate || ''}
                onChange={(e) => setEditingProject(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                value={editingProject.endDate || ''}
                onChange={(e) => setEditingProject(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Progreso (%)"
                type="number"
                value={editingProject.progress || 0}
                onChange={(e) => setEditingProject(prev => ({ ...prev, progress: Number(e.target.value) }))}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveProject} variant="contained">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el proyecto "{selectedProject?.name}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteProject} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}