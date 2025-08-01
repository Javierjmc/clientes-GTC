import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  DateRange as DateIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

// Tipos locales
interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  totalRevenue: number;
  totalProjects: number;
  completedProjects: number;
  activeAssistants: number;
  clientSatisfaction: number;
  averageProjectDuration: number;
}

interface ProjectReport {
  id: string;
  name: string;
  clientName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget: number;
  actualCost: number;
  hoursWorked: number;
  assistantName: string;
  profitMargin: number;
}

interface AssistantPerformance {
  id: string;
  name: string;
  projectsCompleted: number;
  averageRating: number;
  totalHours: number;
  revenue: number;
  efficiency: number;
}

interface ClientReport {
  id: string;
  name: string;
  totalProjects: number;
  totalSpent: number;
  averageProjectValue: number;
  satisfactionScore: number;
  lastProjectDate: string;
}

// Datos de ejemplo
const mockMonthlyReports: MonthlyReport[] = [
  {
    id: '1',
    month: 'Enero',
    year: 2024,
    totalRevenue: 15000,
    totalProjects: 8,
    completedProjects: 6,
    activeAssistants: 4,
    clientSatisfaction: 4.5,
    averageProjectDuration: 21
  },
  {
    id: '2',
    month: 'Febrero',
    year: 2024,
    totalRevenue: 18500,
    totalProjects: 10,
    completedProjects: 8,
    activeAssistants: 4,
    clientSatisfaction: 4.7,
    averageProjectDuration: 19
  },
  {
    id: '3',
    month: 'Marzo',
    year: 2024,
    totalRevenue: 22000,
    totalProjects: 12,
    completedProjects: 10,
    activeAssistants: 5,
    clientSatisfaction: 4.6,
    averageProjectDuration: 18
  },
  {
    id: '4',
    month: 'Abril',
    year: 2024,
    totalRevenue: 19800,
    totalProjects: 9,
    completedProjects: 7,
    activeAssistants: 4,
    clientSatisfaction: 4.8,
    averageProjectDuration: 20
  },
  {
    id: '5',
    month: 'Mayo',
    year: 2024,
    totalRevenue: 25300,
    totalProjects: 14,
    completedProjects: 12,
    activeAssistants: 5,
    clientSatisfaction: 4.9,
    averageProjectDuration: 17
  },
  {
    id: '6',
    month: 'Junio',
    year: 2024,
    totalRevenue: 28700,
    totalProjects: 16,
    completedProjects: 14,
    activeAssistants: 6,
    clientSatisfaction: 4.7,
    averageProjectDuration: 16
  }
];

const mockProjectReports: ProjectReport[] = [
  {
    id: '1',
    name: 'Desarrollo Web Corporativo',
    clientName: 'TechCorp Solutions',
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 5000,
    actualCost: 4200,
    hoursWorked: 168,
    assistantName: 'Ana García',
    profitMargin: 16
  },
  {
    id: '2',
    name: 'Gestión de Redes Sociales',
    clientName: 'StartupXYZ',
    status: 'in_progress',
    startDate: '2024-02-01',
    budget: 3000,
    actualCost: 1800,
    hoursWorked: 90,
    assistantName: 'Carlos Rodríguez',
    profitMargin: 40
  },
  {
    id: '3',
    name: 'Investigación de Mercado',
    clientName: 'DataAnalytics Inc',
    status: 'completed',
    startDate: '2024-01-10',
    endDate: '2024-01-30',
    budget: 4000,
    actualCost: 3500,
    hoursWorked: 140,
    assistantName: 'María López',
    profitMargin: 12.5
  },
  {
    id: '4',
    name: 'Traducción de Contenido',
    clientName: 'GlobalTech Ltd',
    status: 'pending',
    startDate: '2024-03-01',
    budget: 2500,
    actualCost: 0,
    hoursWorked: 0,
    assistantName: 'David Chen',
    profitMargin: 0
  }
];

const mockAssistantPerformance: AssistantPerformance[] = [
  {
    id: '1',
    name: 'Ana García',
    projectsCompleted: 15,
    averageRating: 4.8,
    totalHours: 600,
    revenue: 15000,
    efficiency: 92
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    projectsCompleted: 12,
    averageRating: 4.6,
    totalHours: 480,
    revenue: 9600,
    efficiency: 88
  },
  {
    id: '3',
    name: 'María López',
    projectsCompleted: 18,
    averageRating: 4.9,
    totalHours: 720,
    revenue: 15840,
    efficiency: 95
  },
  {
    id: '4',
    name: 'David Chen',
    projectsCompleted: 22,
    averageRating: 4.7,
    totalHours: 880,
    revenue: 15840,
    efficiency: 90
  }
];

const mockClientReports: ClientReport[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    totalProjects: 5,
    totalSpent: 25000,
    averageProjectValue: 5000,
    satisfactionScore: 4.8,
    lastProjectDate: '2024-02-15'
  },
  {
    id: '2',
    name: 'StartupXYZ',
    totalProjects: 3,
    totalSpent: 12000,
    averageProjectValue: 4000,
    satisfactionScore: 4.6,
    lastProjectDate: '2024-03-01'
  },
  {
    id: '3',
    name: 'DataAnalytics Inc',
    totalProjects: 4,
    totalSpent: 18000,
    averageProjectValue: 4500,
    satisfactionScore: 4.9,
    lastProjectDate: '2024-01-30'
  },
  {
    id: '4',
    name: 'GlobalTech Ltd',
    totalProjects: 2,
    totalSpent: 8000,
    averageProjectValue: 4000,
    satisfactionScore: 4.7,
    lastProjectDate: '2024-03-15'
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const statusColors = {
  'pending': 'warning',
  'in_progress': 'info',
  'completed': 'success',
  'cancelled': 'error'
} as const;

const statusLabels = {
  'pending': 'Pendiente',
  'in_progress': 'En Progreso',
  'completed': 'Completado',
  'cancelled': 'Cancelado'
};

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedYear, setSelectedYear] = useState(2024);
  
  // Estados para datos
  const [monthlyReports] = useState<MonthlyReport[]>(mockMonthlyReports);
  const [projectReports] = useState<ProjectReport[]>(mockProjectReports);
  const [assistantPerformance] = useState<AssistantPerformance[]>(mockAssistantPerformance);
  const [clientReports] = useState<ClientReport[]>(mockClientReports);
  
  // Estados para alertas
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calcular métricas generales
  const totalRevenue = monthlyReports.reduce((sum, report) => sum + report.totalRevenue, 0);
  const totalProjects = monthlyReports.reduce((sum, report) => sum + report.totalProjects, 0);
  const completedProjects = monthlyReports.reduce((sum, report) => sum + report.completedProjects, 0);
  const averageSatisfaction = monthlyReports.reduce((sum, report) => sum + report.clientSatisfaction, 0) / monthlyReports.length;
  
  // Calcular crecimiento mensual
  const currentMonth = monthlyReports[monthlyReports.length - 1];
  const previousMonth = monthlyReports[monthlyReports.length - 2];
  const revenueGrowth = previousMonth ? calculateGrowth(currentMonth.totalRevenue, previousMonth.totalRevenue) : 0;
  const projectGrowth = previousMonth ? calculateGrowth(currentMonth.totalProjects, previousMonth.totalProjects) : 0;

  // Preparar datos para gráficos
  const revenueChartData = monthlyReports.map(report => ({
    month: report.month,
    revenue: report.totalRevenue,
    projects: report.totalProjects
  }));

  const projectStatusData = [
    { name: 'Completados', value: projectReports.filter(p => p.status === 'completed').length, color: '#00C49F' },
    { name: 'En Progreso', value: projectReports.filter(p => p.status === 'in_progress').length, color: '#0088FE' },
    { name: 'Pendientes', value: projectReports.filter(p => p.status === 'pending').length, color: '#FFBB28' },
    { name: 'Cancelados', value: projectReports.filter(p => p.status === 'cancelled').length, color: '#FF8042' }
  ];

  const assistantRevenueData = assistantPerformance.map(assistant => ({
    name: assistant.name.split(' ')[0],
    revenue: assistant.revenue,
    projects: assistant.projectsCompleted,
    efficiency: assistant.efficiency
  }));

  const handleExportReport = (format: 'pdf' | 'excel') => {
    setAlert({ 
      type: 'info', 
      message: `Exportando reporte en formato ${format.toUpperCase()}...` 
    });
    
    // Simular exportación
    setTimeout(() => {
      setAlert({ 
        type: 'success', 
        message: `Reporte exportado exitosamente en formato ${format.toUpperCase()}` 
      });
    }, 2000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando reportes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Reportes y Análisis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Análisis detallado del rendimiento del negocio
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExportReport('excel')}
          >
            Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => handleExportReport('pdf')}
          >
            PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<EmailIcon />}
          >
            Enviar Reporte
          </Button>
        </Box>
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

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={selectedPeriod}
                label="Período"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="3months">Últimos 3 meses</MenuItem>
                <MenuItem value="6months">Últimos 6 meses</MenuItem>
                <MenuItem value="year">Este año</MenuItem>
                <MenuItem value="all">Todo el tiempo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Año</InputLabel>
              <Select
                value={selectedYear}
                label="Año"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Ingresos Totales
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {revenueGrowth >= 0 ? (
                      <TrendingUpIcon color="success" fontSize="small" />
                    ) : (
                      <TrendingDownIcon color="error" fontSize="small" />
                    )}
                    <Typography 
                      variant="body2" 
                      color={revenueGrowth >= 0 ? 'success.main' : 'error.main'}
                      sx={{ ml: 0.5 }}
                    >
                      {Math.abs(revenueGrowth).toFixed(1)}%
                    </Typography>
                  </Box>
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
                  <WorkIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Proyectos Totales
                  </Typography>
                  <Typography variant="h6">
                    {totalProjects}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {projectGrowth >= 0 ? (
                      <TrendingUpIcon color="success" fontSize="small" />
                    ) : (
                      <TrendingDownIcon color="error" fontSize="small" />
                    )}
                    <Typography 
                      variant="body2" 
                      color={projectGrowth >= 0 ? 'success.main' : 'error.main'}
                      sx={{ ml: 0.5 }}
                    >
                      {Math.abs(projectGrowth).toFixed(1)}%
                    </Typography>
                  </Box>
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
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Tasa de Finalización
                  </Typography>
                  <Typography variant="h6">
                    {((completedProjects / totalProjects) * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(completedProjects / totalProjects) * 100} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <StarIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Satisfacción Promedio
                  </Typography>
                  <Typography variant="h6">
                    {averageSatisfaction.toFixed(1)}/5.0
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(averageSatisfaction / 5) * 100} 
                    color="warning"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes reportes */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Resumen General" icon={<AssessmentIcon />} />
          <Tab label="Rendimiento de Asistentes" icon={<PersonIcon />} />
          <Tab label="Análisis de Proyectos" icon={<WorkIcon />} />
          <Tab label="Reportes de Clientes" icon={<BusinessIcon />} />
        </Tabs>
      </Paper>

      {/* Contenido de tabs */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Gráfico de ingresos */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Evolución de Ingresos y Proyectos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Ingresos' : 'Proyectos'
                    ]} />
                    <Legend />
                    <Bar yAxisId="right" dataKey="projects" fill="#8884d8" name="Proyectos" />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Ingresos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Gráfico de estado de proyectos */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estado de Proyectos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Rendimiento de asistentes */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ingresos por Asistente
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assistantRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Ingresos' : name === 'projects' ? 'Proyectos' : 'Eficiencia %'
                    ]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Ingresos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Tabla de rendimiento */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performers
                </Typography>
                <List>
                  {assistantPerformance
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .slice(0, 4)
                    .map((assistant, index) => (
                    <ListItem key={assistant.id}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={assistant.name}
                        secondary={`Eficiencia: ${assistant.efficiency}% | Rating: ${assistant.averageRating}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Tabla detallada de asistentes */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rendimiento Detallado de Asistentes
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Asistente</TableCell>
                        <TableCell align="right">Proyectos</TableCell>
                        <TableCell align="right">Horas</TableCell>
                        <TableCell align="right">Ingresos</TableCell>
                        <TableCell align="right">Rating</TableCell>
                        <TableCell align="right">Eficiencia</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assistantPerformance.map((assistant) => (
                        <TableRow key={assistant.id}>
                          <TableCell>{assistant.name}</TableCell>
                          <TableCell align="right">{assistant.projectsCompleted}</TableCell>
                          <TableCell align="right">{assistant.totalHours}h</TableCell>
                          <TableCell align="right">{formatCurrency(assistant.revenue)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <StarIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                              {assistant.averageRating}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={assistant.efficiency} 
                                sx={{ width: 60, mr: 1 }}
                              />
                              {assistant.efficiency}%
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Análisis de proyectos */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Análisis Detallado de Proyectos
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Proyecto</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Asistente</TableCell>
                        <TableCell align="right">Presupuesto</TableCell>
                        <TableCell align="right">Costo Real</TableCell>
                        <TableCell align="right">Horas</TableCell>
                        <TableCell align="right">Margen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectReports.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{project.clientName}</TableCell>
                          <TableCell>
                            <Chip 
                              label={statusLabels[project.status]} 
                              color={statusColors[project.status]}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{project.assistantName}</TableCell>
                          <TableCell align="right">{formatCurrency(project.budget)}</TableCell>
                          <TableCell align="right">{formatCurrency(project.actualCost)}</TableCell>
                          <TableCell align="right">{project.hoursWorked}h</TableCell>
                          <TableCell align="right">
                            <Typography 
                              color={project.profitMargin >= 15 ? 'success.main' : project.profitMargin >= 5 ? 'warning.main' : 'error.main'}
                            >
                              {project.profitMargin.toFixed(1)}%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Grid container spacing={3}>
          {/* Reportes de clientes */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Análisis de Clientes
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell align="right">Proyectos</TableCell>
                        <TableCell align="right">Total Gastado</TableCell>
                        <TableCell align="right">Valor Promedio</TableCell>
                        <TableCell align="right">Satisfacción</TableCell>
                        <TableCell>Último Proyecto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientReports.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell align="right">{client.totalProjects}</TableCell>
                          <TableCell align="right">{formatCurrency(client.totalSpent)}</TableCell>
                          <TableCell align="right">{formatCurrency(client.averageProjectValue)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <StarIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                              {client.satisfactionScore}
                            </Box>
                          </TableCell>
                          <TableCell>{formatDate(client.lastProjectDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}