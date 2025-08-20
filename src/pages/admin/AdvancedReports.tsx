import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  DatePicker,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import { Grid } from '../../components/GridFix';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  TableChart as TableChartIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotifications } from '../../components/notificationsystem';
import { ProjectCharts, FinancialCharts, ProductivityCharts } from '../../components/charts/ReportCharts';
import { exportToPDF, exportToExcel, commonColumnConfigs } from '../../utils/exportUtils';

interface ReportData {
  id: string;
  name: string;
  description: string;
  type: 'users' | 'projects' | 'revenue' | 'performance' | 'activity';
  period: string;
  generatedAt: string;
  status: 'completed' | 'processing' | 'failed';
  fileSize?: string;
  downloadUrl?: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface UserActivityData {
  userId: string;
  userName: string;
  email: string;
  lastLogin: string;
  sessionsCount: number;
  totalTime: string;
  actionsCount: number;
  status: 'active' | 'inactive';
}

interface ProjectPerformanceData {
  projectId: string;
  projectName: string;
  client: string;
  progress: number;
  budget: number;
  spent: number;
  team: number;
  deadline: string;
  status: 'on_track' | 'at_risk' | 'delayed';
}

const AdvancedReports = () => {
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedReportType, setSelectedReportType] = useState('overview');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivityData[]>([]);
  const [projectPerformance, setProjectPerformance] = useState<ProjectPerformanceData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Datos de ejemplo
  const mockReports: ReportData[] = [
    {
      id: '1',
      name: 'Reporte de Usuarios - Enero 2024',
      description: 'Análisis completo de actividad de usuarios',
      type: 'users',
      period: 'Enero 2024',
      generatedAt: '2024-01-15T10:30:00Z',
      status: 'completed',
      fileSize: '2.4 MB',
      downloadUrl: '/reports/users-jan-2024.pdf'
    },
    {
      id: '2',
      name: 'Reporte de Proyectos - Q4 2023',
      description: 'Rendimiento y métricas de proyectos',
      type: 'projects',
      period: 'Q4 2023',
      generatedAt: '2024-01-10T15:45:00Z',
      status: 'completed',
      fileSize: '5.1 MB',
      downloadUrl: '/reports/projects-q4-2023.pdf'
    },
    {
      id: '3',
      name: 'Reporte de Ingresos - Diciembre 2023',
      description: 'Análisis financiero y de ingresos',
      type: 'revenue',
      period: 'Diciembre 2023',
      generatedAt: '2024-01-05T09:20:00Z',
      status: 'processing',
      fileSize: undefined,
      downloadUrl: undefined
    }
  ];

  // Datos mock para gráficos
  const mockProjects = [
    {
      id: '1',
      name: 'Plataforma E-commerce',
      status: 'active',
      budget: 120000,
      spent: 85000,
      startDate: '2023-10-01',
      endDate: '2024-02-15',
      client: 'TechCorp',
      progress: 75
    },
    {
      id: '2',
      name: 'App Móvil Finanzas',
      status: 'active',
      budget: 75000,
      spent: 52500,
      startDate: '2023-11-15',
      endDate: '2024-03-01',
      client: 'FinanceInc',
      progress: 60
    },
    {
      id: '3',
      name: 'Sistema CRM',
      status: 'paused',
      budget: 100000,
      spent: 45000,
      startDate: '2023-09-01',
      endDate: '2024-01-20',
      client: 'SalesForce',
      progress: 30
    },
    {
      id: '4',
      name: 'Portal Corporativo',
      status: 'completed',
      budget: 80000,
      spent: 78000,
      startDate: '2023-08-01',
      endDate: '2023-12-15',
      client: 'CorpSolutions',
      progress: 100
    }
  ];

  const mockInvoices = [
    {
      id: '1',
      amount: 25000,
      status: 'paid' as const,
      dueDate: '2024-01-15',
      client: 'TechCorp',
      createdAt: '2023-12-15'
    },
    {
      id: '2',
      amount: 18000,
      status: 'pending' as const,
      dueDate: '2024-02-01',
      client: 'FinanceInc',
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      amount: 32000,
      status: 'overdue' as const,
      dueDate: '2024-01-10',
      client: 'SalesForce',
      createdAt: '2023-12-10'
    }
  ];

  const mockExpenses = [
    {
      id: '1',
      amount: 5000,
      category: 'Software',
      date: '2024-01-05',
      description: 'Licencias de desarrollo'
    },
    {
      id: '2',
      amount: 3000,
      category: 'Hardware',
      date: '2024-01-10',
      description: 'Equipos de oficina'
    },
    {
      id: '3',
      amount: 2000,
      category: 'Marketing',
      date: '2024-01-12',
      description: 'Campaña publicitaria'
    }
  ];

  const mockTasks = [
    {
      id: '1',
      title: 'Diseño de interfaz',
      status: 'completed' as const,
      priority: 'high' as const,
      assignee: 'Juan Pérez',
      createdAt: '2024-01-01',
      completedAt: '2024-01-10',
      estimatedHours: 20,
      actualHours: 18
    },
    {
      id: '2',
      title: 'Desarrollo backend',
      status: 'in_progress' as const,
      priority: 'medium' as const,
      assignee: 'María García',
      createdAt: '2024-01-05',
      estimatedHours: 40,
      actualHours: 25
    },
    {
      id: '3',
      title: 'Testing de aplicación',
      status: 'pending' as const,
      priority: 'low' as const,
      assignee: 'Carlos López',
      createdAt: '2024-01-08',
      estimatedHours: 15
    }
  ];

  const mockUsers = [
    {
      id: '1',
      name: 'Juan Pérez',
      role: 'Developer',
      department: 'Desarrollo'
    },
    {
      id: '2',
      name: 'María García',
      role: 'Backend Developer',
      department: 'Desarrollo'
    },
    {
      id: '3',
      name: 'Carlos López',
      role: 'QA Tester',
      department: 'Calidad'
    }
  ];

  const mockUserActivity: UserActivityData[] = [
    {
      userId: '1',
      userName: 'Juan Pérez',
      email: 'juan.perez@example.com',
      lastLogin: '2024-01-15T10:30:00Z',
      sessionsCount: 45,
      totalTime: '32h 15m',
      actionsCount: 1250,
      status: 'active'
    },
    {
      userId: '2',
      userName: 'María González',
      email: 'maria.gonzalez@example.com',
      lastLogin: '2024-01-14T15:45:00Z',
      sessionsCount: 38,
      totalTime: '28h 30m',
      actionsCount: 980,
      status: 'active'
    },
    {
      userId: '3',
      userName: 'Carlos López',
      email: 'carlos.lopez@example.com',
      lastLogin: '2024-01-10T14:30:00Z',
      sessionsCount: 12,
      totalTime: '8h 45m',
      actionsCount: 320,
      status: 'inactive'
    }
  ];

  const mockProjectPerformance: ProjectPerformanceData[] = [
    {
      projectId: '1',
      projectName: 'Desarrollo E-commerce',
      client: 'TechCorp',
      progress: 85,
      budget: 50000,
      spent: 42500,
      team: 5,
      deadline: '2024-02-15',
      status: 'on_track'
    },
    {
      projectId: '2',
      projectName: 'App Móvil Finanzas',
      client: 'FinanceInc',
      progress: 60,
      budget: 75000,
      spent: 52500,
      team: 7,
      deadline: '2024-03-01',
      status: 'at_risk'
    },
    {
      projectId: '3',
      projectName: 'Sistema CRM',
      client: 'SalesForce',
      progress: 30,
      budget: 100000,
      spent: 45000,
      team: 8,
      deadline: '2024-01-20',
      status: 'delayed'
    }
  ];

  const metricCards: MetricCard[] = [
    {
      title: 'Usuarios Activos',
      value: 1247,
      change: 12.5,
      changeType: 'increase',
      icon: <PeopleIcon />,
      color: 'primary.main'
    },
    {
      title: 'Proyectos Completados',
      value: 89,
      change: 8.3,
      changeType: 'increase',
      icon: <AssignmentIcon />,
      color: 'success.main'
    },
    {
      title: 'Ingresos del Mes',
      value: '$125,000',
      change: -3.2,
      changeType: 'decrease',
      icon: <AttachMoneyIcon />,
      color: 'warning.main'
    },
    {
      title: 'Tiempo Promedio de Sesión',
      value: '24m 30s',
      change: 5.7,
      changeType: 'increase',
      icon: <ScheduleIcon />,
      color: 'info.main'
    }
  ];

  useEffect(() => {
    loadReportsData();
  }, [selectedPeriod, selectedReportType]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setReports(mockReports);
      setUserActivity(mockUserActivity);
      setProjectPerformance(mockProjectPerformance);
    } catch (error) {
      console.error('Error loading reports data:', error);
      showNotification({
        message: 'Error al cargar los datos de reportes',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      showNotification({
        message: 'Generando reporte...',
        severity: 'info'
      });
      
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        name: `Reporte ${selectedReportType} - ${new Date().toLocaleDateString()}`,
        description: `Reporte generado para el período ${selectedPeriod}`,
        type: selectedReportType as any,
        period: selectedPeriod,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        fileSize: '3.2 MB',
        downloadUrl: '/reports/new-report.pdf'
      };
      
      setReports([newReport, ...reports]);
      
      showNotification({
        message: 'Reporte generado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      showNotification({
        message: 'Error al generar el reporte',
        severity: 'error'
      });
    }
  };

  const handleDownloadReport = (report: ReportData) => {
    if (report.downloadUrl) {
      // Simular descarga
      showNotification({
        message: `Descargando ${report.name}...`,
        severity: 'info'
      });
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, report: ReportData) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      case 'on_track': return 'success';
      case 'at_risk': return 'warning';
      case 'delayed': return 'error';
      case 'active': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'processing': return 'Procesando';
      case 'failed': return 'Fallido';
      case 'on_track': return 'En Tiempo';
      case 'at_risk': return 'En Riesgo';
      case 'delayed': return 'Retrasado';
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'decrease': return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default: return null;
    }
  };

  // Funciones de exportación
  const handleExportToPDF = (reportType: string) => {
    try {
      let data: any[] = [];
      let columns: any[] = [];
      let title = '';

      switch (reportType) {
        case 'projects':
          data = mockProjects;
          columns = commonColumnConfigs.projects;
          title = 'Reporte de Proyectos';
          break;
        case 'users':
          data = userActivity;
          columns = [
            { key: 'userName', title: 'Usuario', width: 25 },
            { key: 'email', title: 'Email', width: 30 },
            { key: 'lastLogin', title: 'Último Acceso', width: 20, format: (date: string) => new Date(date).toLocaleDateString('es-ES') },
            { key: 'sessionsCount', title: 'Sesiones', width: 15, align: 'center' as const },
            { key: 'totalTime', title: 'Tiempo Total', width: 15 },
            { key: 'status', title: 'Estado', width: 15, align: 'center' as const }
          ];
          title = 'Reporte de Actividad de Usuarios';
          break;
        case 'performance':
          data = projectPerformance;
          columns = [
            { key: 'projectName', title: 'Proyecto', width: 30 },
            { key: 'client', title: 'Cliente', width: 20 },
            { key: 'progress', title: 'Progreso (%)', width: 15, align: 'center' as const },
            { key: 'budget', title: 'Presupuesto', width: 20, align: 'right' as const, format: (value: number) => `$${value?.toLocaleString() || '0'}` },
            { key: 'spent', title: 'Gastado', width: 20, align: 'right' as const, format: (value: number) => `$${value?.toLocaleString() || '0'}` },
            { key: 'status', title: 'Estado', width: 15, align: 'center' as const }
          ];
          title = 'Reporte de Rendimiento de Proyectos';
          break;
        default:
          data = reports;
          columns = [
            { key: 'name', title: 'Nombre', width: 35 },
            { key: 'type', title: 'Tipo', width: 15, align: 'center' as const },
            { key: 'period', title: 'Período', width: 20 },
            { key: 'generatedAt', title: 'Generado', width: 20, format: (date: string) => new Date(date).toLocaleDateString('es-ES') },
            { key: 'status', title: 'Estado', width: 15, align: 'center' as const }
          ];
          title = 'Reporte General';
      }

      exportToPDF(data, columns, {
        title,
        subtitle: `Período: ${selectedPeriod}`,
        filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
        orientation: 'landscape',
        includeDate: true,
        includePageNumbers: true
      });

      showNotification({
        message: `Exportando ${title} a PDF...`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showNotification({
        message: 'Error al exportar a PDF',
        severity: 'error'
      });
    }
  };

  const handleExportToExcel = (reportType: string) => {
    try {
      let data: any[] = [];
      let columns: any[] = [];
      let title = '';

      switch (reportType) {
        case 'projects':
          data = mockProjects;
          columns = commonColumnConfigs.projects;
          title = 'Reporte de Proyectos';
          break;
        case 'users':
          data = userActivity;
          columns = [
            { key: 'userName', title: 'Usuario' },
            { key: 'email', title: 'Email' },
            { key: 'lastLogin', title: 'Último Acceso', format: (date: string) => new Date(date).toLocaleDateString('es-ES') },
            { key: 'sessionsCount', title: 'Sesiones' },
            { key: 'totalTime', title: 'Tiempo Total' },
            { key: 'status', title: 'Estado' }
          ];
          title = 'Actividad de Usuarios';
          break;
        case 'performance':
          data = projectPerformance;
          columns = [
            { key: 'projectName', title: 'Proyecto' },
            { key: 'client', title: 'Cliente' },
            { key: 'progress', title: 'Progreso (%)' },
            { key: 'budget', title: 'Presupuesto', format: (value: number) => `$${value?.toLocaleString() || '0'}` },
            { key: 'spent', title: 'Gastado', format: (value: number) => `$${value?.toLocaleString() || '0'}` },
            { key: 'status', title: 'Estado' }
          ];
          title = 'Rendimiento de Proyectos';
          break;
        default:
          data = reports;
          columns = [
            { key: 'name', title: 'Nombre' },
            { key: 'type', title: 'Tipo' },
            { key: 'period', title: 'Período' },
            { key: 'generatedAt', title: 'Generado', format: (date: string) => new Date(date).toLocaleDateString('es-ES') },
            { key: 'status', title: 'Estado' }
          ];
          title = 'Reporte General';
      }

      exportToExcel(data, columns, {
        title,
        filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`
      });

      showNotification({
        message: `Exportando ${title} a Excel...`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showNotification({
        message: 'Error al exportar a Excel',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingSpinner message="Cargando reportes avanzados..." />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reportes Avanzados
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadReportsData}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AnalyticsIcon />}
            onClick={handleGenerateReport}
          >
            Generar Reporte
          </Button>
        </Box>
      </Box>

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
                <MenuItem value="last_7_days">Últimos 7 días</MenuItem>
                <MenuItem value="last_30_days">Últimos 30 días</MenuItem>
                <MenuItem value="last_3_months">Últimos 3 meses</MenuItem>
                <MenuItem value="last_6_months">Últimos 6 meses</MenuItem>
                <MenuItem value="last_year">Último año</MenuItem>
                <MenuItem value="custom">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Reporte</InputLabel>
              <Select
                value={selectedReportType}
                label="Tipo de Reporte"
                onChange={(e) => setSelectedReportType(e.target.value)}
              >
                <MenuItem value="overview">Resumen General</MenuItem>
                <MenuItem value="users">Usuarios</MenuItem>
                <MenuItem value="projects">Proyectos</MenuItem>
                <MenuItem value="revenue">Ingresos</MenuItem>
                <MenuItem value="performance">Rendimiento</MenuItem>
                <MenuItem value="activity">Actividad</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button 
                startIcon={<FileDownloadIcon />} 
                variant="outlined"
                onClick={() => handleExportToPDF(selectedReportType)}
              >
                Exportar PDF
              </Button>
              <Button 
                startIcon={<FileDownloadIcon />} 
                variant="outlined"
                onClick={() => handleExportToExcel(selectedReportType)}
              >
                Exportar Excel
              </Button>
              <Button startIcon={<PrintIcon />} variant="outlined">
                Imprimir
              </Button>
              <Button startIcon={<ShareIcon />} variant="outlined">
                Compartir
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {metric.title}
                    </Typography>
                    <Typography variant="h4">
                      {metric.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {getChangeIcon(metric.changeType)}
                      <Typography 
                        variant="body2" 
                        color={metric.changeType === 'increase' ? 'success.main' : 'error.main'}
                        sx={{ ml: 0.5 }}
                      >
                        {Math.abs(metric.change)}% vs período anterior
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: metric.color }}>
                    {metric.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos de Reportes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {selectedReportType === 'projects' && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Estado de Proyectos" />
                <CardContent>
                  <ProjectCharts.StatusChart data={mockProjects} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Presupuesto vs Gastado" />
                <CardContent>
                  <ProjectCharts.BudgetChart data={mockProjects} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Progreso de Proyectos" />
                <CardContent>
                  <ProjectCharts.ProgressChart data={mockProjects} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Proyectos por Cliente" />
                <CardContent>
                  <ProjectCharts.ClientChart data={mockProjects} />
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        
        {selectedReportType === 'revenue' && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Estado de Facturas" />
                <CardContent>
                  <FinancialCharts.InvoiceStatusChart data={mockInvoices} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Ingresos vs Gastos Mensuales" />
                <CardContent>
                  <FinancialCharts.MonthlyIncomeChart data={mockInvoices} expenses={mockExpenses} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Gastos por Categoría" />
                <CardContent>
                  <FinancialCharts.ExpensesCategoryChart data={mockExpenses} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Resumen Financiero" />
                <CardContent>
                  <FinancialCharts.SummaryChart invoices={mockInvoices} expenses={mockExpenses} />
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        
        {selectedReportType === 'performance' && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Estado de Tareas" />
                <CardContent>
                  <ProductivityCharts.TaskStatusChart data={mockTasks} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Prioridad de Tareas" />
                <CardContent>
                  <ProductivityCharts.TaskPriorityChart data={mockTasks} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Productividad por Usuario" />
                <CardContent>
                  <ProductivityCharts.UserProductivityChart data={mockUsers} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Tiempo Estimado vs Real" />
                <CardContent>
                  <ProductivityCharts.TimeComparisonChart data={mockTasks} />
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Reportes Generados */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader title="Reportes Generados" />
            <CardContent sx={{ pt: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reporte</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Período</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Tamaño</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{report.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {report.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={report.type} size="small" />
                        </TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(report.status)}
                            color={getStatusColor(report.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{report.fileSize || '-'}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleMenuClick(e, report)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={reports.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Actividad de Usuarios" />
            <CardContent sx={{ pt: 0 }}>
              {userActivity.slice(0, 5).map((user) => (
                <Box key={user.userId} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {user.userName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">{user.userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.sessionsCount} sesiones • {user.totalTime}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusLabel(user.status)}
                    color={getStatusColor(user.status) as any}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rendimiento de Proyectos */}
      <Card>
        <CardHeader title="Rendimiento de Proyectos" />
        <CardContent sx={{ pt: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>Presupuesto</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectPerformance.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell>
                      <Typography variant="subtitle2">{project.projectName}</Typography>
                    </TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{ width: 100, mr: 1 }}
                        />
                        <Typography variant="body2">{project.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{project.team} miembros</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(project.status)}
                        color={getStatusColor(project.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Menú de Acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => {
          if (selectedReport) handleDownloadReport(selectedReport);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Compartir</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={handleMenuClose}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimir</ListItemText>
        </MenuItemComponent>
      </Menu>
    </Box>
  );
};

export default AdvancedReports;