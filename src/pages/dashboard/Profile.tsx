import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos locales
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  company: string;
  position: string;
  bio: string;
  avatar: string;
  role: 'empresario' | 'asistente' | 'administrador';
  joinDate: string;
  lastLogin: string;
  isActive: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectUpdates: boolean;
  invoiceReminders: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  device: string;
}

interface UserStats {
  projectsCompleted: number;
  totalRevenue: number;
  averageRating: number;
  hoursWorked: number;
  clientsServed: number;
}

// Datos de ejemplo
const mockUserProfile: UserProfile = {
  id: '1',
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@email.com',
  phone: '+1 234 567 8900',
  address: 'Calle Principal 123',
  city: 'Madrid',
  country: 'España',
  company: 'TechCorp Solutions',
  position: 'CEO',
  bio: 'Empresario con más de 10 años de experiencia en tecnología y gestión de proyectos.',
  avatar: '',
  role: 'empresario',
  joinDate: '2023-01-15',
  lastLogin: '2024-03-15T10:30:00Z',
  isActive: true
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  projectUpdates: true,
  invoiceReminders: true,
  systemAlerts: true,
  marketingEmails: false
};

const mockSecuritySettings: SecuritySettings = {
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30
};

const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    action: 'login',
    description: 'Inicio de sesión exitoso',
    timestamp: '2024-03-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    device: 'Chrome en Windows'
  },
  {
    id: '2',
    action: 'project_created',
    description: 'Creó el proyecto "Desarrollo Web Corporativo"',
    timestamp: '2024-03-14T15:45:00Z',
    ipAddress: '192.168.1.100',
    device: 'Chrome en Windows'
  },
  {
    id: '3',
    action: 'profile_updated',
    description: 'Actualizó información del perfil',
    timestamp: '2024-03-13T09:20:00Z',
    ipAddress: '192.168.1.100',
    device: 'Chrome en Windows'
  },
  {
    id: '4',
    action: 'password_changed',
    description: 'Cambió la contraseña de la cuenta',
    timestamp: '2024-03-10T14:15:00Z',
    ipAddress: '192.168.1.100',
    device: 'Chrome en Windows'
  }
];

const mockUserStats: UserStats = {
  projectsCompleted: 25,
  totalRevenue: 75000,
  averageRating: 4.8,
  hoursWorked: 1200,
  clientsServed: 15
};

export default function Profile() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para datos
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [activityLog] = useState<ActivityLog[]>(mockActivityLog);
  const [userStats] = useState<UserStats>(mockUserStats);
  
  // Estados para formularios
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estados para alertas
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(formData);
      setEditMode(false);
      setAlert({ type: 'success', message: 'Perfil actualizado exitosamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    setLoading(true);
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setAlert({ type: 'success', message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setAlert({ type: 'success', message: 'Configuración de notificaciones actualizada' });
  };

  const handleSecurityChange = (setting: keyof SecuritySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setAlert({ type: 'success', message: 'Configuración de seguridad actualizada' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      'empresario': 'Empresario',
      'asistente': 'Asistente Virtual',
      'administrador': 'Administrador'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'empresario': 'primary',
      'asistente': 'secondary',
      'administrador': 'error'
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mi Perfil
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona tu información personal y configuraciones
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!editMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Editar Perfil
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={loading}
              >
                Guardar
              </Button>
            </>
          )}
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

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Información Personal" icon={<PersonIcon />} />
          <Tab label="Estadísticas" icon={<TrendingUpIcon />} />
          <Tab label="Notificaciones" icon={<NotificationsIcon />} />
          <Tab label="Seguridad" icon={<SecurityIcon />} />
          <Tab label="Actividad" icon={<HistoryIcon />} />
        </Tabs>
      </Paper>

      {/* Contenido de tabs */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    editMode ? (
                      <IconButton
                        color="primary"
                        component="label"
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                      >
                        <PhotoCameraIcon fontSize="small" />
                        <input type="file" hidden accept="image/*" />
                      </IconButton>
                    ) : null
                  }
                >
                  <Avatar
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: '2rem' }}
                    src={profile.avatar}
                  >
                    {getInitials(profile.firstName, profile.lastName)}
                  </Avatar>
                </Badge>
                
                <Typography variant="h5" gutterBottom>
                  {profile.firstName} {profile.lastName}
                </Typography>
                
                <Chip 
                  label={getRoleLabel(profile.role)} 
                  color={getRoleColor(profile.role) as any}
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {profile.bio}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información de contacto
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.email}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.phone}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.city}, {profile.country}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.company}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Formulario de edición */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información Personal
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ciudad"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="País"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Posición"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Biografía"
                      multiline
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
                
                {!editMode && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      Cambiar Contraseña
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Estadísticas del usuario */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <WorkIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Proyectos Completados
                    </Typography>
                    <Typography variant="h5">
                      {userStats.projectsCompleted}
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
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Ingresos Totales
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(userStats.totalRevenue)}
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
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Calificación Promedio
                    </Typography>
                    <Typography variant="h5">
                      {userStats.averageRating}/5.0
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
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Horas Trabajadas
                    </Typography>
                    <Typography variant="h5">
                      {userStats.hoursWorked}h
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de Actividad
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Miembro desde: {formatDate(profile.joinDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Último acceso: {formatDate(profile.lastLogin)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clientes atendidos: {userStats.clientsServed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración de Notificaciones
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificaciones por Email"
                      secondary="Recibir notificaciones importantes por correo electrónico"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificaciones Push"
                      secondary="Recibir notificaciones en tiempo real en el navegador"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Actualizaciones de Proyectos"
                      secondary="Notificar cuando hay cambios en los proyectos"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.projectUpdates}
                        onChange={() => handleNotificationChange('projectUpdates')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Recordatorios de Facturas"
                      secondary="Recibir recordatorios sobre facturas pendientes"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.invoiceReminders}
                        onChange={() => handleNotificationChange('invoiceReminders')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Alertas del Sistema"
                      secondary="Notificaciones sobre seguridad y mantenimiento"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.systemAlerts}
                        onChange={() => handleNotificationChange('systemAlerts')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Emails de Marketing"
                      secondary="Recibir información sobre nuevas funciones y promociones"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onChange={() => handleNotificationChange('marketingEmails')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración de Seguridad
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Autenticación de Dos Factores"
                      secondary="Agregar una capa extra de seguridad a tu cuenta"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Alertas de Inicio de Sesión"
                      secondary="Recibir notificaciones cuando alguien acceda a tu cuenta"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tiempo de Sesión"
                      secondary="Tiempo en minutos antes de cerrar sesión automáticamente"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleSecurityChange('sessionTimeout', Number(e.target.value))}
                        >
                          <MenuItem value={15}>15 minutos</MenuItem>
                          <MenuItem value={30}>30 minutos</MenuItem>
                          <MenuItem value={60}>1 hora</MenuItem>
                          <MenuItem value={120}>2 horas</MenuItem>
                          <MenuItem value={0}>Sin límite</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  onClick={() => setShowPasswordDialog(true)}
                  sx={{ mr: 2 }}
                >
                  Cambiar Contraseña
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Descargar Datos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Registro de Actividad
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Acción</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>IP</TableCell>
                        <TableCell>Dispositivo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityLog.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Chip 
                              label={activity.action} 
                              size="small" 
                              color={activity.action === 'login' ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>{formatDate(activity.timestamp)}</TableCell>
                          <TableCell>{activity.ipAddress}</TableCell>
                          <TableCell>{activity.device}</TableCell>
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

      {/* Dialog para cambiar contraseña */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Contraseña Actual"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            {loading ? <LinearProgress /> : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}