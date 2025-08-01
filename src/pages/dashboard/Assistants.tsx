import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
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
  Tab,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos locales
interface VirtualAssistant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  hourlyRate: number;
  availability: 'Completa' | 'Parcial' | 'No disponible';
  rating: number;
  completedProjects: number;
  joinDate: string;
  languages: string[];
  timezone: string;
  avatarUrl?: string;
  bio?: string;
  specialties: string[];
  certifications: string[];
}

interface Project {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assistantId?: string;
}

// Datos de ejemplo
const mockAssistants: VirtualAssistant[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@example.com',
    phone: '+1 (555) 123-4567',
    skills: ['Desarrollo Web', 'React', 'Node.js', 'SEO', 'Copywriting'],
    hourlyRate: 25,
    availability: 'Completa',
    rating: 4.8,
    completedProjects: 15,
    joinDate: '2023-01-15',
    languages: ['Español', 'Inglés'],
    timezone: 'GMT-5',
    bio: 'Desarrolladora web full-stack con más de 5 años de experiencia en React y Node.js. Especializada en crear aplicaciones web modernas y optimizadas.',
    specialties: ['Frontend Development', 'Backend Development', 'SEO Optimization'],
    certifications: ['React Developer Certification', 'Google Analytics Certified']
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '+1 (555) 234-5678',
    skills: ['Redes Sociales', 'Diseño Gráfico', 'Marketing Digital', 'Adobe Creative Suite'],
    hourlyRate: 20,
    availability: 'Parcial',
    rating: 4.6,
    completedProjects: 12,
    joinDate: '2023-02-20',
    languages: ['Español', 'Inglés', 'Portugués'],
    timezone: 'GMT-3',
    bio: 'Especialista en marketing digital y diseño gráfico. Experto en crear contenido visual atractivo y estrategias de redes sociales efectivas.',
    specialties: ['Social Media Marketing', 'Graphic Design', 'Content Creation'],
    certifications: ['Facebook Blueprint Certified', 'Adobe Certified Expert']
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria.lopez@example.com',
    phone: '+1 (555) 345-6789',
    skills: ['Investigación', 'Análisis de Datos', 'Excel Avanzado', 'Power BI', 'SQL'],
    hourlyRate: 22,
    availability: 'Completa',
    rating: 4.9,
    completedProjects: 18,
    joinDate: '2022-11-10',
    languages: ['Español', 'Inglés'],
    timezone: 'GMT-6',
    bio: 'Analista de datos con experiencia en investigación de mercado y business intelligence. Especializada en convertir datos en insights accionables.',
    specialties: ['Data Analysis', 'Market Research', 'Business Intelligence'],
    certifications: ['Microsoft Power BI Certified', 'Google Data Analytics Certificate']
  },
  {
    id: '4',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 456-7890',
    skills: ['Traducción', 'Localización', 'Copywriting', 'Content Writing'],
    hourlyRate: 18,
    availability: 'Completa',
    rating: 4.7,
    completedProjects: 22,
    joinDate: '2022-08-05',
    languages: ['Español', 'Inglés', 'Chino', 'Japonés'],
    timezone: 'GMT-8',
    bio: 'Traductor y copywriter multilingüe con experiencia en localización de contenido para mercados internacionales.',
    specialties: ['Translation', 'Localization', 'Content Writing'],
    certifications: ['ATA Certified Translator', 'Content Marketing Certification']
  }
];

const mockProjects: Project[] = [
  { id: '1', name: 'Desarrollo Web Corporativo', status: 'in_progress', assistantId: '1' },
  { id: '2', name: 'Gestión de Redes Sociales', status: 'in_progress', assistantId: '2' },
  { id: '3', name: 'Investigación de Mercado', status: 'pending', assistantId: '3' },
  { id: '4', name: 'Traducción de Contenido', status: 'completed', assistantId: '4' }
];

const availabilityColors = {
  'Completa': 'success',
  'Parcial': 'warning',
  'No disponible': 'error'
} as const;

export default function Assistants() {
  const { user } = useAuth();
  const [assistants, setAssistants] = useState<VirtualAssistant[]>([]);
  const [projects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<VirtualAssistant | null>(null);
  const [editingAssistant, setEditingAssistant] = useState<Partial<VirtualAssistant>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para alertas
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setAssistants(mockAssistants);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Obtener todas las habilidades únicas
  const allSkills = Array.from(new Set(assistants.flatMap(a => a.skills)));

  // Filtrar asistentes
  const filteredAssistants = assistants.filter(assistant => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assistant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assistant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAvailability = availabilityFilter === 'all' || assistant.availability === availabilityFilter;
    const matchesSkill = skillFilter === 'all' || assistant.skills.includes(skillFilter);
    
    return matchesSearch && matchesAvailability && matchesSkill;
  });

  // Obtener asistentes paginados
  const paginatedAssistants = filteredAssistants.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCreateAssistant = () => {
    setEditingAssistant({
      name: '',
      email: '',
      skills: [],
      hourlyRate: 15,
      availability: 'Completa',
      rating: 0,
      completedProjects: 0,
      languages: [],
      timezone: 'GMT-5',
      specialties: [],
      certifications: []
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditAssistant = (assistant: VirtualAssistant) => {
    setEditingAssistant(assistant);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleViewAssistant = (assistant: VirtualAssistant) => {
    setSelectedAssistant(assistant);
    setOpenViewDialog(true);
  };

  const handleDeleteAssistant = (assistant: VirtualAssistant) => {
    setSelectedAssistant(assistant);
    setOpenDeleteDialog(true);
  };

  const handleSaveAssistant = () => {
    if (!editingAssistant.name || !editingAssistant.email) {
      setAlert({ type: 'error', message: 'Por favor completa todos los campos requeridos' });
      return;
    }

    if (isEditing) {
      setAssistants(prev => prev.map(a => 
        a.id === editingAssistant.id ? { ...editingAssistant as VirtualAssistant } : a
      ));
      setAlert({ type: 'success', message: 'Asistente actualizado exitosamente' });
    } else {
      const newAssistant: VirtualAssistant = {
        ...editingAssistant as VirtualAssistant,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0]
      };
      setAssistants(prev => [...prev, newAssistant]);
      setAlert({ type: 'success', message: 'Asistente creado exitosamente' });
    }

    setOpenDialog(false);
    setEditingAssistant({});
  };

  const confirmDeleteAssistant = () => {
    if (selectedAssistant) {
      setAssistants(prev => prev.filter(a => a.id !== selectedAssistant.id));
      setAlert({ type: 'success', message: 'Asistente eliminado exitosamente' });
      setOpenDeleteDialog(false);
      setSelectedAssistant(null);
    }
  };

  const getAssistantProjects = (assistantId: string) => {
    return projects.filter(p => p.assistantId === assistantId);
  };

  const renderAssistantCard = (assistant: VirtualAssistant) => {
    const assistantProjects = getAssistantProjects(assistant.id);
    const activeProjects = assistantProjects.filter(p => p.status === 'in_progress').length;

    return (
      <Grid item xs={12} sm={6} md={4} key={assistant.id}>
        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                src={assistant.avatarUrl}
              >
                {assistant.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3">
                  {assistant.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={assistant.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({assistant.rating})
                  </Typography>
                </Box>
                <Chip 
                  label={assistant.availability} 
                  color={availabilityColors[assistant.availability]}
                  size="small"
                />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <EmailIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {assistant.email}
              </Typography>
              {assistant.phone && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {assistant.phone}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <MoneyIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                ${assistant.hourlyRate}/hora
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <WorkIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {assistant.completedProjects} proyectos completados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <ScheduleIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {activeProjects} proyectos activos
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Habilidades principales:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {assistant.skills.slice(0, 3).map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" size="small" />
                ))}
                {assistant.skills.length > 3 && (
                  <Chip label={`+${assistant.skills.length - 3}`} variant="outlined" size="small" />
                )}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Idiomas: {assistant.languages.join(', ')}
              </Typography>
            </Box>
          </CardContent>
          
          <CardActions>
            <Tooltip title="Ver perfil completo">
              <IconButton size="small" color="primary" onClick={() => handleViewAssistant(assistant)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton size="small" color="primary" onClick={() => handleEditAssistant(assistant)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton size="small" color="error" onClick={() => handleDeleteAssistant(assistant)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const renderAssistantTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Asistente</TableCell>
            <TableCell>Disponibilidad</TableCell>
            <TableCell>Tarifa/Hora</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Proyectos</TableCell>
            <TableCell>Habilidades</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAssistants.map((assistant) => {
            const assistantProjects = getAssistantProjects(assistant.id);
            const activeProjects = assistantProjects.filter(p => p.status === 'in_progress').length;
            
            return (
              <TableRow key={assistant.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }} src={assistant.avatarUrl}>
                      {assistant.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{assistant.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assistant.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={assistant.availability} 
                    color={availabilityColors[assistant.availability]}
                    size="small"
                  />
                </TableCell>
                <TableCell>${assistant.hourlyRate}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={assistant.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>({assistant.rating})</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {assistant.completedProjects} completados
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeProjects} activos
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {assistant.skills.slice(0, 2).map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" size="small" />
                    ))}
                    {assistant.skills.length > 2 && (
                      <Chip label={`+${assistant.skills.length - 2}`} variant="outlined" size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Ver perfil">
                    <IconButton size="small" color="primary" onClick={() => handleViewAssistant(assistant)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => handleEditAssistant(assistant)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => handleDeleteAssistant(assistant)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredAssistants.length}
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
        <Typography>Cargando asistentes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Asistentes Virtuales
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona tu equipo de asistentes virtuales
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAssistant}
          size="large"
        >
          Nuevo Asistente
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
              placeholder="Buscar asistentes..."
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
              <InputLabel>Disponibilidad</InputLabel>
              <Select
                value={availabilityFilter}
                label="Disponibilidad"
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="Completa">Completa</MenuItem>
                <MenuItem value="Parcial">Parcial</MenuItem>
                <MenuItem value="No disponible">No disponible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Habilidad</InputLabel>
              <Select
                value={skillFilter}
                label="Habilidad"
                onChange={(e) => setSkillFilter(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                {allSkills.map((skill) => (
                  <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                ))}
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

      {/* Lista de asistentes */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {filteredAssistants.map(renderAssistantCard)}
        </Grid>
      ) : (
        renderAssistantTable()
      )}

      {/* FAB para crear asistente */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateAssistant}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo para ver perfil completo */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ width: 50, height: 50, mr: 2, bgcolor: 'primary.main' }}
              src={selectedAssistant?.avatarUrl}
            >
              {selectedAssistant?.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedAssistant?.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={selectedAssistant?.rating || 0} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>({selectedAssistant?.rating})</Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAssistant && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Información de Contacto</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary={selectedAssistant.email} />
                  </ListItem>
                  {selectedAssistant.phone && (
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText primary={selectedAssistant.phone} />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText primary={`Zona horaria: ${selectedAssistant.timezone}`} />
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>Estadísticas</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><WorkIcon /></ListItemIcon>
                    <ListItemText primary={`${selectedAssistant.completedProjects} proyectos completados`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MoneyIcon /></ListItemIcon>
                    <ListItemText primary={`$${selectedAssistant.hourlyRate}/hora`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {selectedAssistant.availability === 'Completa' ? <CheckCircleIcon color="success" /> : <CancelIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText primary={`Disponibilidad: ${selectedAssistant.availability}`} />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Biografía</Typography>
                <Typography variant="body2" paragraph>
                  {selectedAssistant.bio || 'No hay biografía disponible.'}
                </Typography>
                
                <Typography variant="h6" gutterBottom>Idiomas</Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedAssistant.languages.map((language, index) => (
                    <Chip key={index} label={language} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom>Especialidades</Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedAssistant.specialties.map((specialty, index) => (
                    <Chip key={index} label={specialty} color="primary" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom>Certificaciones</Typography>
                <List dense>
                  {selectedAssistant.certifications.map((cert, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><StarIcon color="primary" /></ListItemIcon>
                      <ListItemText primary={cert} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Habilidades Técnicas</Typography>
                <Box>
                  {selectedAssistant.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="secondary" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
          <Button onClick={() => {
            setOpenViewDialog(false);
            if (selectedAssistant) handleEditAssistant(selectedAssistant);
          }} variant="contained">
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear/editar asistente */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Asistente' : 'Crear Nuevo Asistente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={editingAssistant.name || ''}
                onChange={(e) => setEditingAssistant(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editingAssistant.email || ''}
                onChange={(e) => setEditingAssistant(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={editingAssistant.phone || ''}
                onChange={(e) => setEditingAssistant(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tarifa por Hora"
                type="number"
                value={editingAssistant.hourlyRate || ''}
                onChange={(e) => setEditingAssistant(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Disponibilidad</InputLabel>
                <Select
                  value={editingAssistant.availability || 'Completa'}
                  label="Disponibilidad"
                  onChange={(e) => setEditingAssistant(prev => ({ ...prev, availability: e.target.value as VirtualAssistant['availability'] }))}
                >
                  <MenuItem value="Completa">Completa</MenuItem>
                  <MenuItem value="Parcial">Parcial</MenuItem>
                  <MenuItem value="No disponible">No disponible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Zona Horaria"
                value={editingAssistant.timezone || ''}
                onChange={(e) => setEditingAssistant(prev => ({ ...prev, timezone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografía"
                multiline
                rows={3}
                value={editingAssistant.bio || ''}
                onChange={(e) => setEditingAssistant(prev => ({ ...prev, bio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Habilidades (separadas por comas)"
                value={editingAssistant.skills?.join(', ') || ''}
                onChange={(e) => setEditingAssistant(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
                helperText="Ejemplo: React, Node.js, SEO, Marketing Digital"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Idiomas (separados por comas)"
                value={editingAssistant.languages?.join(', ') || ''}
                onChange={(e) => setEditingAssistant(prev => ({ 
                  ...prev, 
                  languages: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Especialidades (separadas por comas)"
                value={editingAssistant.specialties?.join(', ') || ''}
                onChange={(e) => setEditingAssistant(prev => ({ 
                  ...prev, 
                  specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveAssistant} variant="contained">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar a "{selectedAssistant?.name}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteAssistant} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}