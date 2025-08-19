import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tab,
  Tabs,
  TabPanel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormGroup,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText
} from '@mui/material';
import { Grid } from '../../components/GridFix';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Email as EmailIcon,
  Backup as BackupIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotifications } from '../../components/NotificationSystem';

interface SystemConfig {
  // Configuraciones generales
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  timezone: string;
  language: string;
  currency: string;
  
  // Configuraciones de seguridad
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  
  // Configuraciones de notificaciones
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
  
  // Configuraciones de sistema
  maintenanceMode: boolean;
  debugMode: boolean;
  logLevel: 'error' | 'warning' | 'info' | 'debug';
  maxFileSize: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Configuraciones de API
  apiRateLimit: number;
  apiTimeout: number;
  corsEnabled: boolean;
  allowedOrigins: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const SystemSettings = () => {
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState<SystemConfig>({
    // Valores por defecto
    siteName: 'GTC Clientes',
    siteDescription: 'Sistema de gestión de clientes y proyectos',
    adminEmail: 'admin@gtc.com',
    timezone: 'America/Mexico_City',
    language: 'es',
    currency: 'USD',
    
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: 'immediate',
    
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    maxFileSize: 10,
    backupFrequency: 'daily',
    
    apiRateLimit: 1000,
    apiTimeout: 30,
    corsEnabled: true,
    allowedOrigins: ['http://localhost:3000', 'https://gtc.com']
  });
  const [originDialog, setOriginDialog] = useState(false);
  const [newOrigin, setNewOrigin] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simular carga de configuraciones
      await new Promise(resolve => setTimeout(resolve, 1000));
      // En producción, aquí se cargarían las configuraciones desde la API
    } catch (error) {
      console.error('Error loading settings:', error);
      showNotification({
        message: 'Error al cargar las configuraciones',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showNotification({
        message: 'Configuraciones guardadas correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification({
        message: 'Error al guardar las configuraciones',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleAddOrigin = () => {
    if (newOrigin && !config.allowedOrigins.includes(newOrigin)) {
      setConfig(prev => ({
        ...prev,
        allowedOrigins: [...prev.allowedOrigins, newOrigin]
      }));
      setNewOrigin('');
      setOriginDialog(false);
    }
  };

  const handleRemoveOrigin = (origin: string) => {
    setConfig(prev => ({
      ...prev,
      allowedOrigins: prev.allowedOrigins.filter(o => o !== origin)
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingSpinner message="Cargando configuraciones del sistema..." />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Configuraciones del Sistema
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSettings}
          >
            Recargar
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? undefined : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Box>

      {/* Alertas */}
      {config.maintenanceMode && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Modo de Mantenimiento Activo</Typography>
          El sistema está actualmente en modo de mantenimiento. Los usuarios no podrán acceder a la aplicación.
        </Alert>
      )}

      {config.debugMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Modo Debug Activo</Typography>
          El modo debug está habilitado. Esto puede afectar el rendimiento del sistema.
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="configuraciones">
          <Tab label="General" />
          <Tab label="Seguridad" />
          <Tab label="Notificaciones" />
          <Tab label="Sistema" />
          <Tab label="API" />
        </Tabs>

        {/* Tab Panel 1: General */}
        <CustomTabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Sitio"
                value={config.siteName}
                onChange={(e) => handleConfigChange('siteName', e.target.value)}
                helperText="Nombre que aparecerá en el título de la aplicación"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email del Administrador"
                type="email"
                value={config.adminEmail}
                onChange={(e) => handleConfigChange('adminEmail', e.target.value)}
                helperText="Email para notificaciones importantes del sistema"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción del Sitio"
                multiline
                rows={3}
                value={config.siteDescription}
                onChange={(e) => handleConfigChange('siteDescription', e.target.value)}
                helperText="Descripción que aparecerá en metadatos y páginas de información"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Zona Horaria</InputLabel>
                <Select
                  value={config.timezone}
                  label="Zona Horaria"
                  onChange={(e) => handleConfigChange('timezone', e.target.value)}
                >
                  <MenuItem value="America/Mexico_City">México (GMT-6)</MenuItem>
                  <MenuItem value="America/New_York">Nueva York (GMT-5)</MenuItem>
                  <MenuItem value="America/Los_Angeles">Los Ángeles (GMT-8)</MenuItem>
                  <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                  <MenuItem value="UTC">UTC (GMT+0)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Idioma</InputLabel>
                <Select
                  value={config.language}
                  label="Idioma"
                  onChange={(e) => handleConfigChange('language', e.target.value)}
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={config.currency}
                  label="Moneda"
                  onChange={(e) => handleConfigChange('currency', e.target.value)}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="MXN">MXN ($)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab Panel 2: Seguridad */}
        <CustomTabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Políticas de Contraseñas" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Longitud Mínima"
                        type="number"
                        value={config.passwordMinLength}
                        onChange={(e) => handleConfigChange('passwordMinLength', parseInt(e.target.value))}
                        inputProps={{ min: 6, max: 20 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.passwordRequireSpecialChars}
                            onChange={(e) => handleConfigChange('passwordRequireSpecialChars', e.target.checked)}
                          />
                        }
                        label="Requerir caracteres especiales"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Configuraciones de Sesión" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tiempo de Sesión (minutos)"
                        type="number"
                        value={config.sessionTimeout}
                        onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                        inputProps={{ min: 5, max: 480 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Máximo Intentos de Login"
                        type="number"
                        value={config.maxLoginAttempts}
                        onChange={(e) => handleConfigChange('maxLoginAttempts', parseInt(e.target.value))}
                        inputProps={{ min: 3, max: 10 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.twoFactorAuth}
                            onChange={(e) => handleConfigChange('twoFactorAuth', e.target.checked)}
                          />
                        }
                        label="Habilitar Autenticación de Dos Factores"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab Panel 3: Notificaciones */}
        <CustomTabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Tipos de Notificaciones" />
                <CardContent>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.emailNotifications}
                          onChange={(e) => handleConfigChange('emailNotifications', e.target.checked)}
                        />
                      }
                      label="Notificaciones por Email"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.smsNotifications}
                          onChange={(e) => handleConfigChange('smsNotifications', e.target.checked)}
                        />
                      }
                      label="Notificaciones por SMS"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.pushNotifications}
                          onChange={(e) => handleConfigChange('pushNotifications', e.target.checked)}
                        />
                      }
                      label="Notificaciones Push"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Frecuencia de Notificaciones" />
                <CardContent>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Frecuencia</FormLabel>
                    <RadioGroup
                      value={config.notificationFrequency}
                      onChange={(e) => handleConfigChange('notificationFrequency', e.target.value)}
                    >
                      <FormControlLabel value="immediate" control={<Radio />} label="Inmediata" />
                      <FormControlLabel value="hourly" control={<Radio />} label="Cada hora" />
                      <FormControlLabel value="daily" control={<Radio />} label="Diaria" />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab Panel 4: Sistema */}
        <CustomTabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Configuraciones de Sistema" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.maintenanceMode}
                            onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                          />
                        }
                        label="Modo de Mantenimiento"
                      />
                      <FormHelperText>
                        Cuando está activo, los usuarios no pueden acceder al sistema
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.debugMode}
                            onChange={(e) => handleConfigChange('debugMode', e.target.checked)}
                          />
                        }
                        label="Modo Debug"
                      />
                      <FormHelperText>
                        Habilita información detallada de depuración
                      </FormHelperText>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Configuraciones de Archivos y Logs" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Nivel de Log</InputLabel>
                        <Select
                          value={config.logLevel}
                          label="Nivel de Log"
                          onChange={(e) => handleConfigChange('logLevel', e.target.value)}
                        >
                          <MenuItem value="error">Error</MenuItem>
                          <MenuItem value="warning">Warning</MenuItem>
                          <MenuItem value="info">Info</MenuItem>
                          <MenuItem value="debug">Debug</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tamaño Máximo de Archivo (MB)"
                        type="number"
                        value={config.maxFileSize}
                        onChange={(e) => handleConfigChange('maxFileSize', parseInt(e.target.value))}
                        inputProps={{ min: 1, max: 100 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Frecuencia de Backup</InputLabel>
                        <Select
                          value={config.backupFrequency}
                          label="Frecuencia de Backup"
                          onChange={(e) => handleConfigChange('backupFrequency', e.target.value)}
                        >
                          <MenuItem value="daily">Diario</MenuItem>
                          <MenuItem value="weekly">Semanal</MenuItem>
                          <MenuItem value="monthly">Mensual</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab Panel 5: API */}
        <CustomTabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Configuraciones de API" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Límite de Peticiones por Hora"
                        type="number"
                        value={config.apiRateLimit}
                        onChange={(e) => handleConfigChange('apiRateLimit', parseInt(e.target.value))}
                        inputProps={{ min: 100, max: 10000 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Timeout de API (segundos)"
                        type="number"
                        value={config.apiTimeout}
                        onChange={(e) => handleConfigChange('apiTimeout', parseInt(e.target.value))}
                        inputProps={{ min: 5, max: 300 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.corsEnabled}
                            onChange={(e) => handleConfigChange('corsEnabled', e.target.checked)}
                          />
                        }
                        label="Habilitar CORS"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Orígenes Permitidos (CORS)"
                  action={
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => setOriginDialog(true)}
                    >
                      Agregar
                    </Button>
                  }
                />
                <CardContent>
                  <List>
                    {config.allowedOrigins.map((origin, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={origin} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveOrigin(origin)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Paper>

      {/* Dialog para agregar origen */}
      <Dialog open={originDialog} onClose={() => setOriginDialog(false)}>
        <DialogTitle>Agregar Origen Permitido</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL del Origen"
            type="url"
            fullWidth
            variant="outlined"
            value={newOrigin}
            onChange={(e) => setNewOrigin(e.target.value)}
            placeholder="https://ejemplo.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOriginDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddOrigin} variant="contained">Agregar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemSettings;