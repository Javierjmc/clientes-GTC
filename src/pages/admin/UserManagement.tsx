import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { Grid } from '../../components/GridFix';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotifications } from '../../components/NotificationSystem';
import { User, UserRole, UserStatus } from '../../types';
import { userService } from '../../services/api';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  position: string;
}

const UserManagement = () => {
  const { showNotification } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    department: '',
    position: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Datos de ejemplo - En producción vendrían de la API
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      lastLogin: '2024-01-15T10:30:00Z',
      department: 'Tecnología',
      position: 'Administrador del Sistema'
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@example.com',
      phone: '+1234567891',
      role: 'manager',
      status: 'active',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-14T00:00:00Z',
      lastLogin: '2024-01-14T15:45:00Z',
      department: 'Ventas',
      position: 'Gerente de Ventas'
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos.lopez@example.com',
      phone: '+1234567892',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-13T00:00:00Z',
      lastLogin: '2024-01-13T09:20:00Z',
      department: 'Marketing',
      position: 'Especialista en Marketing'
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      phone: '+1234567893',
      role: 'user',
      status: 'inactive',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      lastLogin: '2024-01-10T14:30:00Z',
      department: 'Recursos Humanos',
      position: 'Coordinadora de RRHH'
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      showNotification({
        message: 'Error al cargar los usuarios',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        department: user.department || '',
        position: user.position || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        department: '',
        position: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updatedUser = {
          ...editingUser,
          ...formData,
          updatedAt: new Date().toISOString()
        };
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        showNotification({
          message: 'Usuario actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo usuario
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: null
        };
        setUsers([...users, newUser]);
        showNotification({
          message: 'Usuario creado correctamente',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      showNotification({
        message: 'Error al guardar el usuario',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(users.filter(u => u.id !== userId));
      showNotification({
        message: 'Usuario eliminado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification({
        message: 'Error al eliminar el usuario',
        severity: 'error'
      });
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const updatedUser = {
          ...user,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        showNotification({
          message: `Usuario ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      showNotification({
        message: 'Error al cambiar el estado del usuario',
        severity: 'error'
      });
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuario';
      default: return role;
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      id: 'user',
      label: 'Usuario',
      render: (user: User) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'role',
      label: 'Rol',
      render: (user: User) => (
        <Chip
          label={getRoleLabel(user.role)}
          color={getRoleColor(user.role) as any}
          size="small"
        />
      )
    },
    {
      id: 'status',
      label: 'Estado',
      render: (user: User) => (
        <Chip
          label={getStatusLabel(user.status)}
          color={getStatusColor(user.status) as any}
          size="small"
        />
      )
    },
    {
      id: 'department',
      label: 'Departamento',
      render: (user: User) => user.department || '-'
    },
    {
      id: 'lastLogin',
      label: 'Último Acceso',
      render: (user: User) => (
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'
      )
    },
    {
      id: 'actions',
      label: 'Acciones',
      render: (user: User) => (
        <IconButton
          onClick={(e) => handleMenuClick(e, user)}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LoadingSpinner message="Cargando usuarios..." />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Usuarios
                  </Typography>
                  <Typography variant="h4">
                    {users.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
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
                    Usuarios Activos
                  </Typography>
                  <Typography variant="h4">
                    {users.filter(u => u.status === 'active').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
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
                    Administradores
                  </Typography>
                  <Typography variant="h4">
                    {users.filter(u => u.role === 'admin').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <AdminIcon />
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
                    Usuarios Inactivos
                  </Typography>
                  <Typography variant="h4">
                    {users.filter(u => u.status === 'inactive').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BlockIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y Búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={roleFilter}
                label="Rol"
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              >
                <MenuItem value="all">Todos los roles</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="manager">Gerente</MenuItem>
                <MenuItem value="user">Usuario</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
                <MenuItem value="suspended">Suspendido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              Exportar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Usuarios */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        loading={loading}
      />

      {/* Menú de Acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => {
          if (selectedUser) handleOpenDialog(selectedUser);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => {
          if (selectedUser) handleToggleStatus(selectedUser.id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            {selectedUser?.status === 'active' ? 
              <BlockIcon fontSize="small" /> : 
              <CheckCircleIcon fontSize="small" />
            }
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.status === 'active' ? 'Desactivar' : 'Activar'}
          </ListItemText>
        </MenuItemComponent>
        <MenuItemComponent 
          onClick={() => {
            if (selectedUser) handleDeleteUser(selectedUser.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItemComponent>
      </Menu>

      {/* Dialog de Crear/Editar Usuario */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role}
                  label="Rol"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="manager">Gerente</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Posición"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="suspended">Suspendido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;