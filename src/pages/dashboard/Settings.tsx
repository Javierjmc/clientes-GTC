import { useState } from 'react';
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
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Backup as BackupIcon,
  CloudSync as CloudSyncIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Fingerprint as FingerprintIcon,
  VpnKey as VpnKeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function Settings() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(null);
  
  // Estados para configuraciones generales
  const [generalSettings, setGeneralSettings] = useState({
    language: 'es',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'MXN',
    theme: 'light',
    compactMode: false,
    autoSave: true,
    autoBackup: true,
    showTutorials: true
  });
  
  // Estados para notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    taskReminders: true,
    projectUpdates: true,
    invoiceAlerts: true,
    reportGeneration: false,
    systemMaintenance: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
    instantAlerts: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  });
  
  // Estados para seguridad
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true,
    deviceTracking: true,
    ipWhitelist: [],
    apiKeyRotation: 30,
    auditLog: true,
    encryptionLevel: 'high'
  });
  
  // Estados para integración
  const [integrationSettings, setIntegrationSettings] = useState({
    googleCalendar: false,
    microsoftOffice: false,
    slack: false,
    trello: false,
    asana: false,
    zapier: false,
    webhooks: [],
    apiAccess: true,
    dataExport: 'weekly',
    cloudSync: true
  });
  
  // Estados para privacidad
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: true,
    crashReports: true,
    usageStatistics: false,
    personalizedAds: false,
    dataRetention: 365,
    anonymizeData: true,
    shareWithPartners: false,
    cookieConsent: true,
    gdprCompliance: true
  });
  
  // Estados para diálogos
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Estados para formularios
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPasswords: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = async (settingsType: string) => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: `Configuración de ${settingsType} guardada exitosamente` });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar la configuración' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAlert({ type: 'success', message: 'Contraseña actualizada exitosamente' });
      setShowPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPasswords: false
      });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackupData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAlert({ type: 'success', message: 'Respaldo creado exitosamente' });
      setShowBackupDialog(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al crear el respaldo' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAlert({ type: 'info', message: 'Solicitud de eliminación enviada. Recibirás un email de confirmación.' });
      setShowDeleteDialog(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al procesar la solicitud' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Configuración
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Personaliza tu experiencia y gestiona la configuración de tu cuenta
        </Typography>
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
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SettingsIcon />} label="General" {...a11yProps(0)} />
          <Tab icon={<NotificationsIcon />} label="Notificaciones" {...a11yProps(1)} />
          <Tab icon={<SecurityIcon />} label="Seguridad" {...a11yProps(2)} />
          <Tab icon={<CloudSyncIcon />} label="Integraciones" {...a11yProps(3)} />
          <Tab icon={<PaletteIcon />} label="Apariencia" {...a11yProps(4)} />
          <Tab icon={<StorageIcon />} label="Privacidad" {...a11yProps(5)} />
        </Tabs>

        {/* Panel General */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Configuración Regional
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Idioma</InputLabel>
                        <Select
                          value={generalSettings.language}
                          label="Idioma"
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
                        >
                          <MenuItem value="es">Español</MenuItem>
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="fr">Français</MenuItem>
                          <MenuItem value="pt">Português</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Zona Horaria</InputLabel>
                        <Select
                          value={generalSettings.timezone}
                          label="Zona Horaria"
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        >
                          <MenuItem value="America/Mexico_City">Ciudad de México (GMT-6)</MenuItem>
                          <MenuItem value="America/New_York">Nueva York (GMT-5)</MenuItem>
                          <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                          <MenuItem value="Asia/Tokyo">Tokio (GMT+9)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Formato de Fecha</InputLabel>
                        <Select
                          value={generalSettings.dateFormat}
                          label="Formato de Fecha"
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                        >
                          <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                          <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                          <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Formato de Hora</InputLabel>
                        <Select
                          value={generalSettings.timeFormat}
                          label="Formato de Hora"
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                        >
                          <MenuItem value="24h">24 horas</MenuItem>
                          <MenuItem value="12h">12 horas (AM/PM)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Moneda</InputLabel>
                        <Select
                          value={generalSettings.currency}
                          label="Moneda"
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                        >
                          <MenuItem value="MXN">Peso Mexicano (MXN)</MenuItem>
                          <MenuItem value="USD">Dólar Americano (USD)</MenuItem>
                          <MenuItem value="EUR">Euro (EUR)</MenuItem>
                          <MenuItem value="GBP">Libra Esterlina (GBP)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSaveSettings('regional')}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Preferencias de la Aplicación
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Modo Compacto" 
                        secondary="Reduce el espaciado en la interfaz"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={generalSettings.compactMode}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <SaveIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Guardado Automático" 
                        secondary="Guarda cambios automáticamente"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={generalSettings.autoSave}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <BackupIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Respaldo Automático" 
                        secondary="Crea respaldos periódicos de tus datos"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={generalSettings.autoBackup}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Mostrar Tutoriales" 
                        secondary="Muestra ayuda contextual y tutoriales"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={generalSettings.showTutorials}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, showTutorials: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSaveSettings('aplicación')}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Notificaciones */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Canales de Notificación
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Notificaciones por Email" 
                        secondary="Recibe notificaciones en tu correo electrónico"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Notificaciones Push" 
                        secondary="Notificaciones en tiempo real en el navegador"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <SmsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Notificaciones SMS" 
                        secondary="Recibe alertas importantes por mensaje de texto"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tipos de Notificación
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Recordatorios de Tareas" 
                        secondary="Alertas sobre fechas de vencimiento"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.taskReminders}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, taskReminders: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Actualizaciones de Proyecto" 
                        secondary="Cambios en el estado de proyectos"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.projectUpdates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, projectUpdates: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <ReportIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Alertas de Facturación" 
                        secondary="Notificaciones sobre facturas y pagos"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.invoiceAlerts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, invoiceAlerts: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Alertas de Seguridad" 
                        secondary="Notificaciones sobre actividad sospechosa"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={notificationSettings.securityAlerts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, securityAlerts: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Horarios de Silencio
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Define un período durante el cual no recibirás notificaciones no urgentes
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.quietHours.enabled}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, enabled: e.target.checked }
                        }))}
                      />
                    }
                    label="Activar horarios de silencio"
                  />
                  
                  {notificationSettings.quietHours.enabled && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Hora de inicio"
                          type="time"
                          value={notificationSettings.quietHours.start}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Hora de fin"
                          type="time"
                          value={notificationSettings.quietHours.end}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSaveSettings('notificaciones')}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Seguridad */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Autenticación
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <VpnKeyIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Autenticación de Dos Factores" 
                        secondary="Agrega una capa extra de seguridad"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <FingerprintIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Autenticación Biométrica" 
                        secondary="Usa huella dactilar o reconocimiento facial"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={securitySettings.biometricAuth}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, biometricAuth: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Alertas de Inicio de Sesión" 
                        secondary="Notifica sobre nuevos inicios de sesión"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<LockIcon />}
                      onClick={() => setShowPasswordDialog(true)}
                      fullWidth
                    >
                      Cambiar Contraseña
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Configuración de Sesión
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Tiempo de Expiración de Sesión: {securitySettings.sessionTimeout} minutos
                    </Typography>
                    <Slider
                      value={securitySettings.sessionTimeout}
                      onChange={(e, value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value as number }))}
                      min={15}
                      max={480}
                      step={15}
                      marks={[
                        { value: 15, label: '15m' },
                        { value: 60, label: '1h' },
                        { value: 240, label: '4h' },
                        { value: 480, label: '8h' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Expiración de Contraseña: {securitySettings.passwordExpiry} días
                    </Typography>
                    <Slider
                      value={securitySettings.passwordExpiry}
                      onChange={(e, value) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: value as number }))}
                      min={30}
                      max={365}
                      step={30}
                      marks={[
                        { value: 30, label: '30d' },
                        { value: 90, label: '90d' },
                        { value: 180, label: '180d' },
                        { value: 365, label: '1año' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  
                  <FormControl fullWidth>
                    <FormLabel component="legend">Nivel de Encriptación</FormLabel>
                    <RadioGroup
                      value={securitySettings.encryptionLevel}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, encryptionLevel: e.target.value }))}
                    >
                      <FormControlLabel value="standard" control={<Radio />} label="Estándar (AES-128)" />
                      <FormControlLabel value="high" control={<Radio />} label="Alto (AES-256)" />
                      <FormControlLabel value="maximum" control={<Radio />} label="Máximo (AES-256 + RSA)" />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSaveSettings('seguridad')}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Integraciones */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Conecta con tus herramientas favoritas
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Integra GTC con otras aplicaciones para mejorar tu flujo de trabajo
              </Typography>
            </Grid>
            
            {[
              { key: 'googleCalendar', name: 'Google Calendar', icon: '📅', description: 'Sincroniza eventos y recordatorios' },
              { key: 'microsoftOffice', name: 'Microsoft Office 365', icon: '📊', description: 'Integra con Word, Excel y PowerPoint' },
              { key: 'slack', name: 'Slack', icon: '💬', description: 'Recibe notificaciones en tu workspace' },
              { key: 'trello', name: 'Trello', icon: '📋', description: 'Sincroniza tableros y tarjetas' },
              { key: 'asana', name: 'Asana', icon: '✅', description: 'Gestión de proyectos y tareas' },
              { key: 'zapier', name: 'Zapier', icon: '⚡', description: 'Automatiza flujos de trabajo' }
            ].map((integration) => (
              <Grid item xs={12} sm={6} md={4} key={integration.key}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {integration.icon}
                      </Typography>
                      <Box>
                        <Typography variant="h6">
                          {integration.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {integration.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={integrationSettings[integration.key as keyof typeof integrationSettings] as boolean}
                          onChange={(e) => setIntegrationSettings(prev => ({ 
                            ...prev, 
                            [integration.key]: e.target.checked 
                          }))}
                        />
                      }
                      label={integrationSettings[integration.key as keyof typeof integrationSettings] ? 'Conectado' : 'Desconectado'}
                    />
                  </CardContent>
                  {integrationSettings[integration.key as keyof typeof integrationSettings] && (
                    <CardActions>
                      <Button size="small">Configurar</Button>
                      <Button size="small" color="error">Desconectar</Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Panel Apariencia */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tema de la Aplicación
                  </Typography>
                  
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={generalSettings.theme}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, theme: e.target.value }))}
                    >
                      <FormControlLabel 
                        value="light" 
                        control={<Radio />} 
                        label="Tema Claro" 
                      />
                      <FormControlLabel 
                        value="dark" 
                        control={<Radio />} 
                        label="Tema Oscuro" 
                      />
                      <FormControlLabel 
                        value="auto" 
                        control={<Radio />} 
                        label="Automático (según el sistema)" 
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personalización
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Próximamente: Colores personalizados, fuentes y más opciones de personalización.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#0288d1'].map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: color,
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          '&:hover': {
                            border: '2px solid #000'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Privacidad */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Tu privacidad es importante para nosotros. Aquí puedes controlar cómo se utilizan tus datos.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recopilación de Datos
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Recopilación de Datos de Uso" 
                        secondary="Ayuda a mejorar la aplicación"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.dataCollection}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataCollection: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Análisis y Métricas" 
                        secondary="Estadísticas de uso anónimas"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.analytics}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, analytics: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Reportes de Errores" 
                        secondary="Envía información sobre errores"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={privacySettings.crashReports}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, crashReports: e.target.checked }))}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Gestión de Datos
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Retención de Datos: {privacySettings.dataRetention} días
                    </Typography>
                    <Slider
                      value={privacySettings.dataRetention}
                      onChange={(e, value) => setPrivacySettings(prev => ({ ...prev, dataRetention: value as number }))}
                      min={30}
                      max={2555}
                      step={30}
                      marks={[
                        { value: 30, label: '30d' },
                        { value: 365, label: '1año' },
                        { value: 1095, label: '3años' },
                        { value: 2555, label: '7años' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      onClick={() => setShowBackupDialog(true)}
                    >
                      Descargar Mis Datos
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      Eliminar Mi Cuenta
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Dialog Cambiar Contraseña */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Contraseña Actual"
              type={passwordForm.showPasswords ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setPasswordForm(prev => ({ ...prev, showPasswords: !prev.showPasswords }))}
                  >
                    {passwordForm.showPasswords ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type={passwordForm.showPasswords ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
              helperText="Mínimo 8 caracteres"
            />
            
            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              type={passwordForm.showPasswords ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword}
              helperText={passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword ? 'Las contraseñas no coinciden' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Respaldo de Datos */}
      <Dialog open={showBackupDialog} onClose={() => setShowBackupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Descargar Datos</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Se creará un archivo con todos tus datos personales, proyectos, tareas e información de la cuenta.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El proceso puede tardar unos minutos dependiendo de la cantidad de datos.
          </Typography>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBackupDialog(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleBackupData} variant="contained" disabled={loading}>
            {loading ? 'Creando Respaldo...' : 'Descargar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Eliminar Cuenta */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Eliminar Cuenta</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
          </Alert>
          <Typography paragraph>
            ¿Estás seguro de que quieres eliminar tu cuenta? Todos tus proyectos, tareas, facturas y datos personales se eliminarán permanentemente.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recibirás un email de confirmación antes de que se complete la eliminación.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
            {loading ? 'Procesando...' : 'Eliminar Cuenta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}