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
  TableRow,
  Alert,
  AlertTitle
} from '@mui/material';
import { Grid } from '../../components/GridFix';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner, CardSkeleton } from '../../components/LoadingSpinner';
import { useNotifications } from '../../components/notificationsystem';

// Interfaces para métricas del sistema
interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  serverUptime: string;
  databaseSize: string;
  apiResponseTime: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'project_created' | 'payment_received' | 'system_alert';
  description: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  userName?: string;
}

interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
  resolved: boolean;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo - En producción vendrían de la API
  const mockMetrics: SystemMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalProjects: 3456,
    activeProjects: 1234,
    totalRevenue: 125000,
    monthlyRevenue: 15000,
    systemHealth: 'good',
    serverUptime: '99.9%',
    databaseSize: '2.4 GB',
    apiResponseTime: 145
  };

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'user_registration',
      description: 'Nuevo usuario registrado: María González',
      timestamp: '2024-01-15T10:30:00Z',
      severity: 'info',
      userId: 'user123',
      userName: 'María González'
    },
    {
      id: '2',
      type: 'project_created',
      description: 'Nuevo proyecto creado: Desarrollo E-commerce',
      timestamp: '2024-01-15T09:15:00Z',
      severity: 'success'
    },
    {
      id: '3',
      type: 'payment_received',
      description: 'Pago recibido: $2,500 USD',
      timestamp: '2024-01-15T08:45:00Z',
      severity: 'success'
    },
    {
      id: '4',
      type: 'system_alert',
      description: 'Alto uso de CPU detectado en servidor principal',
      timestamp: '2024-01-15T08:00:00Z',
      severity: 'warning'
    }
  ];

  const mockSystemAlerts: SystemAlert[] = [
    {
      id: '1',
      title: 'Mantenimiento Programado',
      message: 'Mantenimiento del servidor programado para el 20 de enero a las 2:00 AM',
      severity: 'info',
      timestamp: '2024-01-15T12:00:00Z',
      resolved: false
    },
    {
      id: '2',
      title: 'Espacio en Disco',
      message: 'El espacio en disco está al 85% de capacidad',
      severity: 'warning',
      timestamp: '2024-01-15T11:30:00Z',
      resolved: false
    }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMetrics(mockMetrics);
        setRecentActivity(mockRecentActivity);
        setSystemAlerts(mockSystemAlerts);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification({
          message: 'Error al cargar los datos del dashboard',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [showNotification]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    showNotification({
      message: 'Datos actualizados correctamente',
      severity: 'success'
    });
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <PeopleIcon />;
      case 'project_created': return <AssignmentIcon />;
      case 'payment_received': return <AttachMoneyIcon />;
      case 'system_alert': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingSpinner message="Cargando dashboard de administración..." />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Panel de Administración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido, {user?.name}. Aquí tienes un resumen del estado del sistema.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </Box>

      {/* Alertas del Sistema */}
      {systemAlerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {systemAlerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.severity}
              sx={{ mb: 1 }}
              action={
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Usuarios Totales
                  </Typography>
                  <Typography variant="h4">
                    {metrics?.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    +12% este mes
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Proyectos Activos
                  </Typography>
                  <Typography variant="h4">
                    {metrics?.activeProjects.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    +8% este mes
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <AssignmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Ingresos del Mes
                  </Typography>
                  <Typography variant="h4">
                    ${metrics?.monthlyRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    +15% vs mes anterior
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Estado del Sistema
                  </Typography>
                  <Chip
                    label={metrics?.systemHealth.toUpperCase()}
                    color={getHealthColor(metrics?.systemHealth || 'good') as any}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">
                    Uptime: {metrics?.serverUptime}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <SecurityIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métricas del Sistema */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Métricas del Sistema" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tiempo de Respuesta API
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((metrics?.apiResponseTime || 0) / 500 * 100, 100)}
                    sx={{ flexGrow: 1, mr: 2 }}
                    color={(metrics?.apiResponseTime || 0) > 300 ? 'warning' : 'success'}
                  />
                  <Typography variant="body2">
                    {metrics?.apiResponseTime}ms
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tamaño de Base de Datos
                </Typography>
                <Typography variant="h6">
                  {metrics?.databaseSize}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Usuarios Activos vs Total
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(metrics?.activeUsers || 0) / (metrics?.totalUsers || 1) * 100}
                    sx={{ flexGrow: 1, mr: 2 }}
                    color="info"
                  />
                  <Typography variant="body2">
                    {Math.round((metrics?.activeUsers || 0) / (metrics?.totalUsers || 1) * 100)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Actividad Reciente" />
            <CardContent sx={{ pt: 0 }}>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem key={activity.id} divider={index < recentActivity.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${activity.severity}.light` }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description}
                      secondary={new Date(activity.timestamp).toLocaleString()}
                    />
                    {getSeverityIcon(activity.severity)}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;