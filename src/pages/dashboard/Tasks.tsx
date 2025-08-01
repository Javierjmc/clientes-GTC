import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Fab,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  Checkbox,
  FormControlLabel,
  Switch,
  Slider,
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Flag as FlagIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos locales
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  projectName: string;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  tags: string[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  dependencies: string[];
  subtasks: SubTask[];
}

interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

// Datos de ejemplo
const mockProjects: Project[] = [
  { id: '1', name: 'Desarrollo Web Corporativo', color: '#1976d2' },
  { id: '2', name: 'Gestión de Redes Sociales', color: '#388e3c' },
  { id: '3', name: 'Investigación de Mercado', color: '#f57c00' },
  { id: '4', name: 'Traducción de Contenido', color: '#7b1fa2' }
];

const mockUsers: User[] = [
  { id: '1', name: 'Ana García', avatar: '', role: 'Desarrolladora' },
  { id: '2', name: 'Carlos Rodríguez', avatar: '', role: 'Diseñador' },
  { id: '3', name: 'María López', avatar: '', role: 'Analista' },
  { id: '4', name: 'David Chen', avatar: '', role: 'Traductor' }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Diseño de la página principal',
    description: 'Crear el diseño responsive de la página principal del sitio web corporativo',
    status: 'in_progress',
    priority: 'high',
    projectId: '1',
    projectName: 'Desarrollo Web Corporativo',
    assignedTo: '2',
    assignedToName: 'Carlos Rodríguez',
    createdBy: '1',
    createdByName: 'Ana García',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    dueDate: '2024-03-20T23:59:59Z',
    estimatedHours: 16,
    actualHours: 12,
    progress: 75,
    tags: ['diseño', 'frontend', 'responsive'],
    comments: [
      {
        id: '1',
        userId: '1',
        userName: 'Ana García',
        userAvatar: '',
        content: 'Por favor, asegúrate de que el diseño sea compatible con dispositivos móviles.',
        createdAt: '2024-03-10T10:00:00Z'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Carlos Rodríguez',
        userAvatar: '',
        content: 'Ya tengo el primer borrador listo. Lo subiré para revisión.',
        createdAt: '2024-03-12T15:30:00Z'
      }
    ],
    attachments: [
      {
        id: '1',
        name: 'mockup-homepage.figma',
        url: '#',
        type: 'application/figma',
        size: 2048000,
        uploadedBy: 'Carlos Rodríguez',
        uploadedAt: '2024-03-12T15:30:00Z'
      }
    ],
    dependencies: [],
    subtasks: [
      { id: '1', title: 'Wireframe inicial', completed: true },
      { id: '2', title: 'Diseño desktop', completed: true },
      { id: '3', title: 'Diseño móvil', completed: false, assignedTo: '2', dueDate: '2024-03-18T23:59:59Z' },
      { id: '4', title: 'Prototipo interactivo', completed: false, assignedTo: '2', dueDate: '2024-03-20T23:59:59Z' }
    ]
  },
  {
    id: '2',
    title: 'Implementación del backend API',
    description: 'Desarrollar las APIs REST para el sistema de gestión de usuarios',
    status: 'todo',
    priority: 'urgent',
    projectId: '1',
    projectName: 'Desarrollo Web Corporativo',
    assignedTo: '1',
    assignedToName: 'Ana García',
    createdBy: '1',
    createdByName: 'Ana García',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z',
    dueDate: '2024-03-25T23:59:59Z',
    estimatedHours: 32,
    actualHours: 0,
    progress: 0,
    tags: ['backend', 'api', 'nodejs'],
    comments: [],
    attachments: [],
    dependencies: ['1'],
    subtasks: [
      { id: '1', title: 'Configuración del servidor', completed: false },
      { id: '2', title: 'Modelos de datos', completed: false },
      { id: '3', title: 'Endpoints de autenticación', completed: false },
      { id: '4', title: 'Endpoints de usuarios', completed: false },
      { id: '5', title: 'Documentación API', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Estrategia de contenido para Instagram',
    description: 'Desarrollar una estrategia de contenido para los próximos 3 meses',
    status: 'review',
    priority: 'medium',
    projectId: '2',
    projectName: 'Gestión de Redes Sociales',
    assignedTo: '3',
    assignedToName: 'María López',
    createdBy: '2',
    createdByName: 'Carlos Rodríguez',
    createdAt: '2024-02-28T08:00:00Z',
    updatedAt: '2024-03-14T16:45:00Z',
    dueDate: '2024-03-18T23:59:59Z',
    estimatedHours: 20,
    actualHours: 18,
    progress: 90,
    tags: ['marketing', 'contenido', 'instagram'],
    comments: [
      {
        id: '1',
        userId: '3',
        userName: 'María López',
        userAvatar: '',
        content: 'He completado la investigación de tendencias y competencia.',
        createdAt: '2024-03-08T14:20:00Z'
      }
    ],
    attachments: [
      {
        id: '1',
        name: 'estrategia-contenido-q2.pdf',
        url: '#',
        type: 'application/pdf',
        size: 1536000,
        uploadedBy: 'María López',
        uploadedAt: '2024-03-14T16:45:00Z'
      }
    ],
    dependencies: [],
    subtasks: [
      { id: '1', title: 'Análisis de competencia', completed: true },
      { id: '2', title: 'Definición de objetivos', completed: true },
      { id: '3', title: 'Calendario de publicaciones', completed: true },
      { id: '4', title: 'Templates de contenido', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Traducción de documentos técnicos',
    description: 'Traducir la documentación técnica del inglés al español',
    status: 'completed',
    priority: 'low',
    projectId: '4',
    projectName: 'Traducción de Contenido',
    assignedTo: '4',
    assignedToName: 'David Chen',
    createdBy: '1',
    createdByName: 'Ana García',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-03-10T17:30:00Z',
    dueDate: '2024-03-10T23:59:59Z',
    estimatedHours: 24,
    actualHours: 22,
    progress: 100,
    tags: ['traducción', 'documentación', 'técnico'],
    comments: [
      {
        id: '1',
        userId: '4',
        userName: 'David Chen',
        userAvatar: '',
        content: 'Traducción completada y revisada. Lista para entrega.',
        createdAt: '2024-03-10T17:30:00Z'
      }
    ],
    attachments: [
      {
        id: '1',
        name: 'documentacion-tecnica-es.docx',
        url: '#',
        type: 'application/docx',
        size: 3072000,
        uploadedBy: 'David Chen',
        uploadedAt: '2024-03-10T17:30:00Z'
      }
    ],
    dependencies: [],
    subtasks: [
      { id: '1', title: 'Traducción inicial', completed: true },
      { id: '2', title: 'Revisión técnica', completed: true },
      { id: '3', title: 'Corrección de estilo', completed: true },
      { id: '4', title: 'Entrega final', completed: true }
    ]
  }
];

const statusColors = {
  'todo': 'default',
  'in_progress': 'info',
  'review': 'warning',
  'completed': 'success',
  'cancelled': 'error'
} as const;

const statusLabels = {
  'todo': 'Por Hacer',
  'in_progress': 'En Progreso',
  'review': 'En Revisión',
  'completed': 'Completado',
  'cancelled': 'Cancelado'
};

const priorityColors = {
  'low': 'success',
  'medium': 'warning',
  'high': 'error',
  'urgent': 'error'
} as const;

const priorityLabels = {
  'low': 'Baja',
  'medium': 'Media',
  'high': 'Alta',
  'urgent': 'Urgente'
};

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Estados para el formulario
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    projectId: '',
    assignedTo: '',
    dueDate: '',
    estimatedHours: 8,
    tags: [],
    subtasks: []
  });
  
  // Estados para comentarios
  const [newComment, setNewComment] = useState('');
  
  // Estados para menús
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  
  // Estados para alertas
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter, assigneeFilter, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...tasks];
    
    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtros por categoría
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    if (projectFilter !== 'all') {
      filtered = filtered.filter(task => task.projectId === projectFilter);
    }
    
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === assigneeFilter);
    }
    
    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: '',
      assignedTo: '',
      dueDate: '',
      estimatedHours: 8,
      tags: [],
      subtasks: []
    });
    setEditMode(true);
    setShowTaskDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormData(task);
    setEditMode(true);
    setShowTaskDialog(true);
    setAnchorEl(null);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowDetailDialog(true);
  };

  const handleSaveTask = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedTask) {
        // Editar tarea existente
        setTasks(prev => prev.map(task => 
          task.id === selectedTask.id 
            ? { ...task, ...formData, updatedAt: new Date().toISOString() }
            : task
        ));
        setAlert({ type: 'success', message: 'Tarea actualizada exitosamente' });
      } else {
        // Crear nueva tarea
        const newTask: Task = {
          ...formData as Task,
          id: Date.now().toString(),
          createdBy: user?.id || '1',
          createdByName: user?.firstName + ' ' + user?.lastName || 'Usuario',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          actualHours: 0,
          progress: 0,
          comments: [],
          attachments: [],
          dependencies: [],
          projectName: mockProjects.find(p => p.id === formData.projectId)?.name || '',
          assignedToName: mockUsers.find(u => u.id === formData.assignedTo)?.name || ''
        };
        setTasks(prev => [...prev, newTask]);
        setAlert({ type: 'success', message: 'Tarea creada exitosamente' });
      }
      
      setShowTaskDialog(false);
      setEditMode(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar la tarea' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setAlert({ type: 'success', message: 'Tarea eliminada exitosamente' });
      setAnchorEl(null);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar la tarea' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus, 
              progress: newStatus === 'completed' ? 100 : task.progress,
              updatedAt: new Date().toISOString() 
            }
          : task
      ));
      setAlert({ type: 'success', message: 'Estado actualizado exitosamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar el estado' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    
    const comment: TaskComment = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      userName: user?.firstName + ' ' + user?.lastName || 'Usuario',
      userAvatar: '',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => prev.map(task => 
      task.id === selectedTask.id 
        ? { ...task, comments: [...task.comments, comment] }
        : task
    ));
    
    setSelectedTask(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
    setNewComment('');
    setAlert({ type: 'success', message: 'Comentario agregado' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => {
      const daysUntilDue = getDaysUntilDue(t.dueDate);
      return daysUntilDue < 0 && t.status !== 'completed';
    }).length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Tareas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Organiza y supervisa todas las tareas del proyecto
          </Typography>
        </Box>
        <Fab
          color="primary"
          onClick={handleCreateTask}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
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

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total de Tareas
                  </Typography>
                  <Typography variant="h5">
                    {stats.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <PlayIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    En Progreso
                  </Typography>
                  <Typography variant="h5">
                    {stats.inProgress}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completadas
                  </Typography>
                  <Typography variant="h5">
                    {stats.completed}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Vencidas
                  </Typography>
                  <Typography variant="h5">
                    {stats.overdue}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="todo">Por Hacer</MenuItem>
                <MenuItem value="in_progress">En Progreso</MenuItem>
                <MenuItem value="review">En Revisión</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={priorityFilter}
                label="Prioridad"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="urgent">Urgente</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="low">Baja</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Proyecto</InputLabel>
              <Select
                value={projectFilter}
                label="Proyecto"
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                {mockProjects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Asignado a</InputLabel>
              <Select
                value={assigneeFilter}
                label="Asignado a"
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                {mockUsers.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Filtros">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ordenar">
                <IconButton>
                  <SortIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de tareas */}
      <Grid container spacing={3}>
        {filteredTasks.map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate);
          const isOverdue = daysUntilDue < 0 && task.status !== 'completed';
          const project = mockProjects.find(p => p.id === task.projectId);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isOverdue ? '2px solid' : '1px solid',
                  borderColor: isOverdue ? 'error.main' : 'divider',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header de la tarea */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip 
                          label={statusLabels[task.status]} 
                          color={statusColors[task.status]}
                          size="small"
                        />
                        <Chip 
                          label={priorityLabels[task.priority]} 
                          color={priorityColors[task.priority]}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setMenuTaskId(task.id);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  {/* Descripción */}
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description.length > 100 
                      ? `${task.description.substring(0, 100)}...` 
                      : task.description
                    }
                  </Typography>
                  
                  {/* Proyecto */}
                  {project && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkIcon fontSize="small" sx={{ mr: 1, color: project.color }} />
                      <Typography variant="body2" color="text.secondary">
                        {project.name}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Asignado a */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                      {getInitials(task.assignedToName)}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {task.assignedToName}
                    </Typography>
                  </Box>
                  
                  {/* Progreso */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progreso
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={task.progress} 
                      color={task.status === 'completed' ? 'success' : 'primary'}
                    />
                  </Box>
                  
                  {/* Fecha de vencimiento */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: isOverdue ? 'error.main' : 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color={isOverdue ? 'error.main' : 'text.secondary'}
                    >
                      {formatDate(task.dueDate)}
                      {isOverdue && ` (${Math.abs(daysUntilDue)} días vencida)`}
                      {daysUntilDue > 0 && daysUntilDue <= 3 && ` (${daysUntilDue} días restantes)`}
                    </Typography>
                  </Box>
                  
                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                      {task.tags.length > 3 && (
                        <Chip 
                          label={`+${task.tags.length - 3}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}
                  
                  {/* Estadísticas adicionales */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {task.comments.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CommentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {task.comments.length}
                          </Typography>
                        </Box>
                      )}
                      {task.attachments.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachmentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {task.attachments.length}
                          </Typography>
                        </Box>
                      )}
                      {task.subtasks.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {task.actualHours}h / {task.estimatedHours}h
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewTask(task)}
                  >
                    Ver Detalles
                  </Button>
                  {task.status !== 'completed' && (
                    <Button 
                      size="small" 
                      startIcon={<PlayIcon />}
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                      disabled={task.status === 'in_progress'}
                    >
                      {task.status === 'in_progress' ? 'En Progreso' : 'Iniciar'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItemComponent onClick={() => {
          const task = tasks.find(t => t.id === menuTaskId);
          if (task) handleViewTask(task);
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver Detalles</ListItemText>
        </MenuItemComponent>
        
        <MenuItemComponent onClick={() => {
          const task = tasks.find(t => t.id === menuTaskId);
          if (task) handleEditTask(task);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItemComponent>
        
        <Divider />
        
        <MenuItemComponent 
          onClick={() => {
            if (menuTaskId) handleDeleteTask(menuTaskId);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItemComponent>
      </Menu>

      {/* Dialog de creación/edición de tareas */}
      <Dialog 
        open={showTaskDialog} 
        onClose={() => setShowTaskDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Proyecto</InputLabel>
                  <Select
                    value={formData.projectId}
                    label="Proyecto"
                    onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    {mockProjects.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Asignar a</InputLabel>
                  <Select
                    value={formData.assignedTo}
                    label="Asignar a"
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  >
                    {mockUsers.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.status}
                    label="Estado"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                  >
                    <MenuItem value="todo">Por Hacer</MenuItem>
                    <MenuItem value="in_progress">En Progreso</MenuItem>
                    <MenuItem value="review">En Revisión</MenuItem>
                    <MenuItem value="completed">Completado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Prioridad</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Prioridad"
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                  >
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="urgent">Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de Vencimiento"
                  type="datetime-local"
                  value={formData.dueDate ? formData.dueDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value + ':00.000Z' }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Horas Estimadas"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
                  inputProps={{ min: 1, max: 200 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTaskDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained"
            disabled={loading || !formData.title || !formData.projectId || !formData.assignedTo}
          >
            {loading ? 'Guardando...' : selectedTask ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de detalles de tarea */}
      <Dialog 
        open={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
        maxWidth="lg" 
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedTask.title}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={statusLabels[selectedTask.status]} 
                    color={statusColors[selectedTask.status]}
                    size="small"
                  />
                  <Chip 
                    label={priorityLabels[selectedTask.priority]} 
                    color={priorityColors[selectedTask.priority]}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Información principal */}
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    {selectedTask.description}
                  </Typography>
                  
                  {/* Progreso */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Progreso: {selectedTask.progress}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedTask.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  {/* Subtareas */}
                  {selectedTask.subtasks.length > 0 && (
                    <Accordion sx={{ mb: 3 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Subtareas ({selectedTask.subtasks.filter(st => st.completed).length}/{selectedTask.subtasks.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {selectedTask.subtasks.map((subtask) => (
                            <ListItem key={subtask.id} dense>
                              <ListItemIcon>
                                <Checkbox 
                                  checked={subtask.completed}
                                  disabled
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={subtask.title}
                                secondary={subtask.dueDate ? `Vence: ${formatDate(subtask.dueDate)}` : undefined}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  
                  {/* Comentarios */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Comentarios ({selectedTask.comments.length})
                    </Typography>
                    
                    {selectedTask.comments.map((comment) => (
                      <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                            {getInitials(comment.userName)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{comment.userName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(comment.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2">{comment.content}</Typography>
                      </Box>
                    ))}
                    
                    {/* Agregar comentario */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <TextField
                        fullWidth
                        placeholder="Agregar un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        multiline
                        rows={2}
                      />
                      <Button 
                        variant="contained" 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        sx={{ alignSelf: 'flex-end' }}
                      >
                        Enviar
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Panel lateral */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Detalles de la Tarea
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <WorkIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Proyecto" 
                          secondary={selectedTask.projectName}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Asignado a" 
                          secondary={selectedTask.assignedToName}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Creado por" 
                          secondary={selectedTask.createdByName}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Fecha de vencimiento" 
                          secondary={formatDate(selectedTask.dueDate)}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <TimerIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Tiempo" 
                          secondary={`${selectedTask.actualHours}h / ${selectedTask.estimatedHours}h`}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Creado" 
                          secondary={formatDateTime(selectedTask.createdAt)}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Actualizado" 
                          secondary={formatDateTime(selectedTask.updatedAt)}
                        />
                      </ListItem>
                    </List>
                    
                    {/* Tags */}
                    {selectedTask.tags.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Etiquetas
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedTask.tags.map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Archivos adjuntos */}
                    {selectedTask.attachments.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Archivos Adjuntos
                        </Typography>
                        <List dense>
                          {selectedTask.attachments.map((attachment) => (
                            <ListItem key={attachment.id}>
                              <ListItemIcon>
                                <AttachmentIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={attachment.name}
                                secondary={`${(attachment.size / 1024 / 1024).toFixed(1)} MB`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDetailDialog(false)}>Cerrar</Button>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={() => {
                  setShowDetailDialog(false);
                  handleEditTask(selectedTask);
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}