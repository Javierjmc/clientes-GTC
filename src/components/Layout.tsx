import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserRole } from '../types';

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
  window?: () => Window;
}

export default function Layout({ children, window }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, toggleTheme, setThemeMode } = useTheme();
  const [themeMenu, setThemeMenu] = useState<null | HTMLElement>(null);
  
  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenu(event.currentTarget);
  };
  
  const handleThemeMenuClose = () => {
    setThemeMenu(null);
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeMode(newTheme);
    handleThemeMenuClose();
  };
  
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Menú para empresarios
  const empresarioMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Asistentes', icon: <PeopleIcon />, path: '/assistants' },
    { text: 'Proyectos', icon: <AssignmentIcon />, path: '/projects' },
    { text: 'Facturas', icon: <ReceiptIcon />, path: '/invoices' },
    { text: 'Informes', icon: <DescriptionIcon />, path: '/reports' }
  ];

  // Menú para administradores
  const adminMenuItems = [
    { text: 'Dashboard Admin', icon: <AdminPanelSettingsIcon />, path: '/admin/dashboard' },
    { text: 'Gestión de Usuarios', icon: <SupervisorAccountIcon />, path: '/admin/users' },
    { text: 'Configuración Sistema', icon: <SettingsIcon />, path: '/admin/settings' },
    { text: 'Reportes Avanzados', icon: <AssessmentIcon />, path: '/admin/reports' }
  ];

  // Seleccionar el menú según el rol del usuario
  const menuItems = user?.role === UserRole.ADMINISTRADOR ? adminMenuItems : empresarioMenuItems;

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          GTC Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  // Si el usuario no está autenticado, solo mostrar el contenido sin el layout
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.role === UserRole.ADMINISTRADOR ? 'Panel de Administración' : 'Portal del Cliente'}
          </Typography>
          
          <Tooltip title="Cambiar tema">
            <IconButton 
              color="inherit" 
              onClick={handleThemeMenuOpen}
              aria-controls="theme-menu"
              aria-haspopup="true"
              aria-label="cambiar tema"
            >
              {mode === 'light' && <LightModeIcon />}
              {mode === 'dark' && <DarkModeIcon />}
              {mode === 'auto' && <SettingsBrightnessIcon />}
              <ArrowDropDownIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Menu
            id="theme-menu"
            anchorEl={themeMenu}
            keepMounted
            open={Boolean(themeMenu)}
            onClose={handleThemeMenuClose}
          >
            <MenuItem onClick={() => handleThemeChange('light')}>
              <ListItemIcon>
                <LightModeIcon fontSize="small" />
              </ListItemIcon>
              Tema Claro
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange('dark')}>
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              Tema Oscuro
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange('auto')}>
              <ListItemIcon>
                <SettingsBrightnessIcon fontSize="small" />
              </ListItemIcon>
              Automático (sistema)
            </MenuItem>
          </Menu>
          
          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}