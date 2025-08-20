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
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  Autorenew as AutorenewIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner, CardSkeleton } from '../../components/LoadingSpinner';
import { useNotifications } from '../../components/notificationsystem';
import { Project, Task, VirtualAssistant, Invoice, InvoiceItem } from '../../types';

// Los tipos ahora se importan desde el archivo centralizado

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
  { id: '1', number: 'INV-2023-001', date: '2023-10-01', dueDate: '2023-10-15', amount: 450, status: 'paid', clientName: 'Empresa ABC', items: [] },
  { id: '2', number: 'INV-2023-002', date: '2023-10-05', dueDate: '2023-10-20', amount: 320, status: 'pending', clientName: 'Corporación XYZ', items: [] },
  { id: '3', number: 'INV-2023-003', date: '2023-10-12', dueDate: '2023-10-27', amount: 580, status: 'overdue', clientName: 'Consultora 123', items: [] },
  { id: '4', number: 'INV-2023-004', date: '2023-10-18', dueDate: '2023-11-02', amount: 750, status: 'pending', clientName: 'Distribuidora MNO', items: [] },
  { id: '5', number: 'INV-2023-005', date: '2023-10-22', dueDate: '2023-11-06', amount: 420, status: 'paid', clientName: 'Servicios DEF', items: [] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assistants, setAssistants] = useState<VirtualAssistant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Simular carga de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProjects(mockProjects);
        setAssistants(mockAssistants);
        setTasks(mockTasks);
        setInvoices(mockInvoices);
        
        showSuccess('Datos cargados correctamente');
      } catch (error) {
        showError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showSuccess, showError]);

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
      <Box sx={{ p: 3 }}>
        <LoadingSpinner message="Cargando dashboard..." />
        <Box sx={{ mt: 4 }}>
          <CardSkeleton count={4} />
        </Box>
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
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              },
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '5px', 
                bgcolor: 'primary.main' 
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Proyectos
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <AssignmentIcon />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
              {totalProjects}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <AutorenewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {activeProjects} proyectos activos
              </Typography>
              <Chip 
                label={`${Math.round((activeProjects / totalProjects) * 100)}% activos`} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
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
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              },
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '5px', 
                bgcolor: 'success.main' 
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Asistentes
              </Typography>
              <Avatar sx={{ bgcolor: 'success.dark', color: 'success.contrastText', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <PeopleIcon />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
              {totalAssistants}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Asistentes virtuales asignados
              </Typography>
              <Chip 
                label={`100% disponibles`} 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
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
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              },
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '5px', 
                bgcolor: 'warning.main' 
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Facturas
              </Typography>
              <Avatar sx={{ bgcolor: 'warning.dark', color: 'warning.contrastText', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <AttachMoneyIcon />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
              ${totalInvoiceAmount}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {pendingInvoices} facturas pendientes
              </Typography>
              <Chip 
                label={`$${pendingInvoiceAmount} por cobrar`} 
                size="small" 
                color="warning" 
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
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
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              },
              bgcolor: 'info.light',
              color: 'info.contrastText',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '5px', 
                bgcolor: 'info.main' 
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Tareas
              </Typography>
              <Avatar sx={{ bgcolor: 'info.dark', color: 'info.contrastText', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <AccessTimeIcon />
              </Avatar>
            </Box>
            <Typography component="p" variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
              {tasks.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <HourglassEmptyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                {tasks.filter(t => t.status === 'pending').length} tareas pendientes
              </Typography>
              <Chip 
                label={`${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}% completadas`} 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Proyectos en curso */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Proyectos en Curso
              </Typography>
              <Button 
                size="small" 
                endIcon={<VisibilityIcon />} 
                color="primary" 
                variant="contained"
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                }}
              >
                Ver todos
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {projects.length > 0 ? (
              projects.map((project) => (
                <Box 
                  key={project.id} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    borderRadius: 2, 
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      transition: 'background-color 0.3s'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <AssignmentIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {project.name}
                      </Typography>
                    </Box>
                    <Chip 
                      label={project.status === 'in_progress' ? 'En progreso' : 
                             project.status === 'pending' ? 'Pendiente' : 
                             project.status === 'completed' ? 'Completado' : 
                             project.status === 'cancelled' ? 'Cancelado' : 'Desconocido'} 
                      size="small" 
                      color={project.status === 'in_progress' ? 'primary' : 
                             project.status === 'pending' ? 'warning' : 
                             project.status === 'completed' ? 'success' : 
                             project.status === 'cancelled' ? 'error' : 'default'}
                      sx={{ fontWeight: 'medium', height: 24 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={project.progress || 0} 
                        size={24} 
                        thickness={6}
                        sx={{ 
                          color: project.progress && project.progress < 30 ? 'warning.main' : 
                                 project.progress && project.progress < 70 ? 'primary.main' : 
                                 'success.main',
                          mr: 1 
                        }}
                      />
                      <Typography variant="body2" sx={{ mr: 1, fontWeight: 'medium' }}>
                        Progreso: {project.progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Fecha límite: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No definida'}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress || 0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5,
                      bgcolor: 'rgba(0, 0, 0, 0.08)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundImage: project.progress && project.progress < 30 ? 
                          'linear-gradient(90deg, #ff9800, #ff9800)' :
                          project.progress && project.progress < 70 ?
                          'linear-gradient(90deg, #2196f3, #2196f3)' :
                          'linear-gradient(90deg, #4caf50, #4caf50)',
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                      sx={{ 
                        borderRadius: 2, 
                        mr: 1,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        py: 0.5
                      }}
                      startIcon={<MoreVertIcon sx={{ fontSize: 14 }} />}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        py: 0.5,
                        boxShadow: 'none',
                        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                      }}
                      startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                    >
                      Ver detalles
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                No hay proyectos activos actualmente.
              </Typography>
            )}
          </Paper>
          
          {/* Facturas Recientes */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Facturas Recientes
              </Typography>
              <Button 
                size="small" 
                endIcon={<VisibilityIcon />} 
                color="warning" 
                variant="contained"
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                }}
              >
                Ver todas
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {invoices.length > 0 ? (
              <TableContainer component={Box} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small" sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Número</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Vencimiento</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.slice(0, 5).map((invoice) => (
                      <TableRow 
                        key={invoice.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            transition: 'background-color 0.3s'
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ReceiptIcon sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              #{invoice.number}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{invoice.clientName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{invoice.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{invoice.dueDate}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            ${invoice.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                            color={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              minWidth: 80,
                              fontWeight: 'medium',
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: 'success.main',
                                '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' }
                              }}
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No hay facturas recientes
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Asistentes y Tareas Recientes */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader 
              title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Asistentes Virtuales</Typography>} 
              action={
                <Button size="small" color="primary" endIcon={<VisibilityIcon />} sx={{ mr: 1 }}>
                  Ver todos
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {assistants.map((assistant) => (
                  <ListItem 
                    key={assistant.id} 
                    alignItems="flex-start"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transition: 'background-color 0.3s'
                      },
                      borderRadius: 1,
                      my: 0.5,
                      mx: 1,
                      width: 'calc(100% - 16px)'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        alt={assistant.name} 
                        src={assistant.avatarUrl || undefined}
                        sx={{ 
                          bgcolor: 'primary.main',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {assistant.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {assistant.name}
                          </Typography>
                          <Chip 
                            label={assistant.status === 'active' ? 'Activo' : 'Inactivo'} 
                            size="small" 
                            color={assistant.status === 'active' ? 'success' : 'default'}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography
                              component="span"
                              variant="body2"
                              color="primary"
                              sx={{ fontWeight: 'medium' }}
                            >
                              ${assistant.hourlyRate}/hora
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                              •
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {assistant.specialty}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 0.5 }}>
                            {assistant.skills.slice(0, 2).map((skill, index) => (
                              <Chip 
                                key={index}
                                label={skill} 
                                size="small" 
                                sx={{ mr: 0.5, mt: 0.5, height: 20, fontSize: '0.7rem' }}
                                variant="outlined"
                              />
                            ))}
                            {assistant.skills.length > 2 && (
                              <Chip 
                                label={`+${assistant.skills.length - 2}`} 
                                size="small" 
                                sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                                variant="outlined"
                              />
                            )}
                          </Box>
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
              title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tareas Recientes</Typography>} 
              action={
                <Button size="small" color="primary" endIcon={<VisibilityIcon />} sx={{ mr: 1 }}>
                  Ver todas
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {tasks.slice(0, 5).map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const assistant = assistants.find(a => a.id === task.assignedTo);
                  
                  return (
                    <ListItem 
                      key={task.id} 
                      alignItems="flex-start"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          transition: 'background-color 0.3s'
                        },
                        borderRadius: 1,
                        my: 0.5,
                        mx: 1,
                        width: 'calc(100% - 16px)'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: task.status === 'completed' ? 'success.main' : 
                                    task.status === 'in_progress' ? 'primary.main' : 
                                    'warning.main',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {task.status === 'completed' ? <ArrowUpwardIcon /> : 
                           task.status === 'in_progress' ? <AccessTimeIcon /> : 
                           <ArrowDownwardIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{task.title}</Typography>
                            <Chip 
                              label={task.status === 'completed' ? 'Completada' : 
                                     task.status === 'in_progress' ? 'En progreso' : 
                                     task.status === 'pending' ? 'Pendiente' : 'Desconocido'} 
                              size="small" 
                              color={
                                task.status === 'completed' ? 'success' : 
                                task.status === 'in_progress' ? 'primary' : 
                                task.status === 'pending' ? 'warning' : 'default'
                              }
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                                {project?.name}
                              </Typography>
                              {assistant && (
                                <>
                                  <Typography component="span" variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                                    •
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {assistant?.name}
                                  </Typography>
                                </>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                Vence: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No definida'}
                              </Typography>
                            </Box>
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