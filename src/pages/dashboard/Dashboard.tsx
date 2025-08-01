import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Grid } from '../../components/GridFix';
import {
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos definidos localmente
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
  deadline?: string;
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
  assignedTo?: string;
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
  avatarUrl?: string;
  hourlyRate?: number;
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
  clientId?: string;
  number: string;
  amount: number;
  currency?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  issueDate?: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  notes?: string;
  date?: string;
}

// Datos de ejemplo - En una aplicación real, estos vendrían de una API
const mockProjects: Project[] = [
  { id: '1', name: 'Desarrollo Web', description: 'Desarrollo de sitio web corporativo', status: 'in_progress', progress: 65, deadline: '2023-12-31', assistantId: '1' },
  { id: '2', name: 'Gestión de Redes Sociales', description: 'Administración de perfiles sociales', status: 'in_progress', progress: 40, deadline: '2023-11-15', assistantId: '2' },
  { id: '3', name: 'Investigación de Mercado', description: 'Análisis de competencia', status: 'pending', progress: 10, deadline: '2023-12-01', assistantId: '3' },
];

const mockAssistants: VirtualAssistant[] = [
  { id: '1', name: 'Ana García', email: 'ana@example.com', skills: ['Desarrollo Web', 'SEO', 'Copywriting'], hourlyRate: 15, specialty: 'Desarrollo Web', status: 'active', createdAt: '2023-01-01', avatarUrl: '' },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@example.com', skills: ['Redes Sociales', 'Diseño Gráfico'], hourlyRate: 12, specialty: 'Diseño', status: 'active', createdAt: '2023-02-15', avatarUrl: '' },
  { id: '3', name: 'María López', email: 'maria@example.com', skills: ['Investigación', 'Análisis de Datos'], hourlyRate: 14, specialty: 'Análisis', status: 'active', createdAt: '2023-03-10', avatarUrl: '' },
];

const mockTasks: Task[] = [
  { id: '1', title: 'Diseñar página de inicio', description: 'Crear mockups para homepage', status: 'completed', projectId: '1', dueDate: '2023-10-15', assignedTo: '1', createdAt: '2023-10-01', updatedAt: '2023-10-10' },
  { id: '2', title: 'Implementar autenticación', description: 'Desarrollar sistema de login', status: 'in_progress', projectId: '1', dueDate: '2023-10-20', assignedTo: '1', createdAt: '2023-10-05', updatedAt: '2023-10-12' },
  { id: '3', title: 'Publicar contenido semanal', description: 'Crear y programar posts', status: 'pending', projectId: '2', dueDate: '2023-10-18', assignedTo: '2', createdAt: '2023-10-08', updatedAt: '2023-10-08' },
  { id: '4', title: 'Analizar competidores', description: 'Investigar 5 competidores principales', status: 'in_progress', projectId: '3', dueDate: '2023-10-25', assignedTo: '3', createdAt: '2023-10-10', updatedAt: '2023-10-15' },
];

const mockInvoices: Invoice[] = [
  { id: '1', number: 'INV-2023-001', date: '2023-10-01', dueDate: '2023-10-15', amount: 450, status: 'paid', items: [] },
  { id: '2', number: 'INV-2023-002', date: '2023-10-05', dueDate: '2023-10-20', amount: 320, status: 'pending', items: [] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assistants, setAssistants] = useState<VirtualAssistant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setAssistants(mockAssistants);
      setTasks(mockTasks);
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calcular estadísticas
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const totalAssistants = assistants.length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingInvoiceAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Panel de control de tu cuenta empresarial
      </Typography>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Proyectos
              </Typography>
              <AssignmentIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              {totalProjects}
            </Typography>
            <Typography variant="body2">
              {activeProjects} proyectos activos
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Asistentes
              </Typography>
              <PeopleIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              {totalAssistants}
            </Typography>
            <Typography variant="body2">
              Asistentes virtuales asignados
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Facturas
              </Typography>
              <AttachMoneyIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ${totalInvoiceAmount}
            </Typography>
            <Typography variant="body2">
              {pendingInvoices} facturas pendientes (${pendingInvoiceAmount})
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'info.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Tareas
              </Typography>
              <AccessTimeIcon />
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              {tasks.length}
            </Typography>
            <Typography variant="body2">
              {tasks.filter(t => t.status === 'pending').length} tareas pendientes
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Proyectos en curso */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Proyectos en Curso
              </Typography>
              <Button size="small" endIcon={<VisibilityIcon />}>
                Ver todos
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {projects.length > 0 ? (
              projects.map((project) => (
                <Box key={project.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {project.name}
                    </Typography>
                    <Chip 
                      label={project.status} 
                      size="small" 
                      color={project.status === 'in_progress' ? 'primary' : 'default'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Progreso: {project.progress}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha límite: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No definida'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                No hay proyectos activos actualmente.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Asistentes y Tareas Recientes */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader 
              title="Asistentes Virtuales" 
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {assistants.map((assistant) => (
                  <ListItem key={assistant.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={assistant.name} src={assistant.avatarUrl || undefined}>
                        {assistant.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assistant.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ${assistant.hourlyRate}/hora
                          </Typography>
                          {" — "}
                          {assistant.skills.join(', ')}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardHeader 
              title="Tareas Recientes" 
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {tasks.slice(0, 5).map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const assistant = assistants.find(a => a.id === task.assignedTo);
                  
                  return (
                    <ListItem key={task.id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: task.status === 'completed' ? 'success.main' : 'primary.main' }}>
                          {task.status === 'completed' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">{task.title}</Typography>
                            <Chip 
                              label={task.status} 
                              size="small" 
                              color={
                                task.status === 'completed' ? 'success' : 
                                task.status === 'in_progress' ? 'primary' : 
                                task.status === 'pending' ? 'warning' : 'default'
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {project?.name} - {assistant?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Vence: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No definida'}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}