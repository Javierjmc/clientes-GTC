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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateIcon,
  Person as PersonIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Print as PrintIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos locales
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

// Datos de ejemplo
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    clientName: 'TechCorp Solutions',
    clientEmail: 'billing@techcorp.com',
    projectName: 'Desarrollo Web Corporativo',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'paid',
    items: [
      {
        id: '1',
        description: 'Desarrollo Frontend - React',
        quantity: 40,
        unitPrice: 25,
        total: 1000
      },
      {
        id: '2',
        description: 'Desarrollo Backend - Node.js',
        quantity: 30,
        unitPrice: 30,
        total: 900
      },
      {
        id: '3',
        description: 'Diseño UI/UX',
        quantity: 20,
        unitPrice: 35,
        total: 700
      }
    ],
    subtotal: 2600,
    tax: 416,
    total: 3016,
    notes: 'Gracias por su confianza en nuestros servicios.',
    paymentTerms: 'Pago a 30 días'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    clientName: 'StartupXYZ',
    clientEmail: 'finance@startupxyz.com',
    projectName: 'Gestión de Redes Sociales',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    status: 'sent',
    items: [
      {
        id: '1',
        description: 'Gestión de contenido - Instagram',
        quantity: 30,
        unitPrice: 20,
        total: 600
      },
      {
        id: '2',
        description: 'Gestión de contenido - Facebook',
        quantity: 25,
        unitPrice: 20,
        total: 500
      },
      {
        id: '3',
        description: 'Diseño gráfico para posts',
        quantity: 15,
        unitPrice: 25,
        total: 375
      }
    ],
    subtotal: 1475,
    tax: 236,
    total: 1711,
    notes: 'Incluye reportes mensuales de métricas.',
    paymentTerms: 'Pago a 15 días'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    clientName: 'DataAnalytics Inc',
    clientEmail: 'accounts@dataanalytics.com',
    projectName: 'Investigación de Mercado',
    issueDate: '2024-01-25',
    dueDate: '2024-01-30',
    status: 'overdue',
    items: [
      {
        id: '1',
        description: 'Investigación de mercado - Sector tecnológico',
        quantity: 50,
        unitPrice: 22,
        total: 1100
      },
      {
        id: '2',
        description: 'Análisis de competencia',
        quantity: 20,
        unitPrice: 28,
        total: 560
      },
      {
        id: '3',
        description: 'Informe ejecutivo',
        quantity: 10,
        unitPrice: 40,
        total: 400
      }
    ],
    subtotal: 2060,
    tax: 329.6,
    total: 2389.6,
    notes: 'Entrega incluye dashboard interactivo.',
    paymentTerms: 'Pago inmediato'
  },
  {
    id: '4',
    number: 'INV-2024-004',
    clientName: 'GlobalTech Ltd',
    clientEmail: 'billing@globaltech.com',
    projectName: 'Traducción de Contenido',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    status: 'draft',
    items: [
      {
        id: '1',
        description: 'Traducción ES-EN - Documentación técnica',
        quantity: 100,
        unitPrice: 18,
        total: 1800
      },
      {
        id: '2',
        description: 'Revisión y corrección',
        quantity: 20,
        unitPrice: 25,
        total: 500
      }
    ],
    subtotal: 2300,
    tax: 368,
    total: 2668,
    notes: 'Incluye glosario de términos técnicos.',
    paymentTerms: 'Pago a 30 días'
  }
];

const mockProjects: Project[] = [
  { id: '1', name: 'Desarrollo Web Corporativo', clientName: 'TechCorp Solutions', status: 'in_progress' },
  { id: '2', name: 'Gestión de Redes Sociales', clientName: 'StartupXYZ', status: 'in_progress' },
  { id: '3', name: 'Investigación de Mercado', clientName: 'DataAnalytics Inc', status: 'completed' },
  { id: '4', name: 'Traducción de Contenido', clientName: 'GlobalTech Ltd', status: 'pending' }
];

const statusColors = {
  'draft': 'default',
  'sent': 'info',
  'paid': 'success',
  'overdue': 'error',
  'cancelled': 'warning'
} as const;

const statusLabels = {
  'draft': 'Borrador',
  'sent': 'Enviada',
  'paid': 'Pagada',
  'overdue': 'Vencida',
  'cancelled': 'Cancelada'
};

const statusIcons = {
  'draft': <EditIcon />,
  'sent': <SendIcon />,
  'paid': <CheckCircleIcon />,
  'overdue': <WarningIcon />,
  'cancelled': <CancelIcon />
};

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Partial<Invoice>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para alertas
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar facturas
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const invoiceDate = new Date(invoice.issueDate);
      
      switch (dateFilter) {
        case 'this_month':
          matchesDate = invoiceDate.getMonth() === now.getMonth() && 
                       invoiceDate.getFullYear() === now.getFullYear();
          break;
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          matchesDate = invoiceDate.getMonth() === lastMonth.getMonth() && 
                       invoiceDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'this_year':
          matchesDate = invoiceDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Obtener facturas paginadas
  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calcular estadísticas
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((sum, invoice) => sum + invoice.total, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + invoice.total, 0);

  const handleCreateInvoice = () => {
    const nextNumber = `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`;
    setEditingInvoice({
      number: nextNumber,
      clientName: '',
      clientEmail: '',
      projectName: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paymentTerms: 'Pago a 30 días'
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenViewDialog(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenDeleteDialog(true);
  };

  const handleSaveInvoice = () => {
    if (!editingInvoice.clientName || !editingInvoice.projectName) {
      setAlert({ type: 'error', message: 'Por favor completa todos los campos requeridos' });
      return;
    }

    if (isEditing) {
      setInvoices(prev => prev.map(i => 
        i.id === editingInvoice.id ? { ...editingInvoice as Invoice } : i
      ));
      setAlert({ type: 'success', message: 'Factura actualizada exitosamente' });
    } else {
      const newInvoice: Invoice = {
        ...editingInvoice as Invoice,
        id: Date.now().toString()
      };
      setInvoices(prev => [...prev, newInvoice]);
      setAlert({ type: 'success', message: 'Factura creada exitosamente' });
    }

    setOpenDialog(false);
    setEditingInvoice({});
  };

  const confirmDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.filter(i => i.id !== selectedInvoice.id));
      setAlert({ type: 'success', message: 'Factura eliminada exitosamente' });
      setOpenDeleteDialog(false);
      setSelectedInvoice(null);
    }
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setInvoices(prev => prev.map(i => 
      i.id === invoice.id ? { ...i, status: 'sent' as const } : i
    ));
    setAlert({ type: 'success', message: `Factura ${invoice.number} enviada exitosamente` });
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setInvoices(prev => prev.map(i => 
      i.id === invoice.id ? { ...i, status: 'paid' as const } : i
    ));
    setAlert({ type: 'success', message: `Factura ${invoice.number} marcada como pagada` });
  };

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

  const renderInvoiceCard = (invoice: Invoice) => (
    <Grid item xs={12} sm={6} md={4} key={invoice.id}>
      <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {invoice.number}
              </Typography>
              <Chip 
                icon={statusIcons[invoice.status]}
                label={statusLabels[invoice.status]} 
                color={statusColors[invoice.status]}
                size="small"
              />
            </Box>
            <Typography variant="h6" color="primary">
              {formatCurrency(invoice.total)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <PersonIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              {invoice.clientName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <ReceiptIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              {invoice.projectName}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <DateIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Emitida: {formatDate(invoice.issueDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <ScheduleIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Vence: {formatDate(invoice.dueDate)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Items: {invoice.items.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Subtotal: {formatCurrency(invoice.subtotal)}
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions>
          <Tooltip title="Ver factura">
            <IconButton size="small" color="primary" onClick={() => handleViewInvoice(invoice)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" color="primary" onClick={() => handleEditInvoice(invoice)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          {invoice.status === 'draft' && (
            <Tooltip title="Enviar">
              <IconButton size="small" color="info" onClick={() => handleSendInvoice(invoice)}>
                <SendIcon />
              </IconButton>
            </Tooltip>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <Tooltip title="Marcar como pagada">
              <IconButton size="small" color="success" onClick={() => handleMarkAsPaid(invoice)}>
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={() => handleDeleteInvoice(invoice)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderInvoiceTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Número</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Emisión</TableCell>
            <TableCell>Fecha Vencimiento</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedInvoices.map((invoice) => (
            <TableRow key={invoice.id} hover>
              <TableCell>
                <Typography variant="subtitle2">{invoice.number}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{invoice.clientName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {invoice.clientEmail}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{invoice.projectName}</Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  icon={statusIcons[invoice.status]}
                  label={statusLabels[invoice.status]} 
                  color={statusColors[invoice.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDate(invoice.issueDate)}</TableCell>
              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="primary">
                  {formatCurrency(invoice.total)}
                </Typography>
              </TableCell>
              <TableCell>
                <Tooltip title="Ver factura">
                  <IconButton size="small" color="primary" onClick={() => handleViewInvoice(invoice)}>
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton size="small" color="primary" onClick={() => handleEditInvoice(invoice)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {invoice.status === 'draft' && (
                  <Tooltip title="Enviar">
                    <IconButton size="small" color="info" onClick={() => handleSendInvoice(invoice)}>
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                  <Tooltip title="Marcar como pagada">
                    <IconButton size="small" color="success" onClick={() => handleMarkAsPaid(invoice)}>
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Eliminar">
                  <IconButton size="small" color="error" onClick={() => handleDeleteInvoice(invoice)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredInvoices.length}
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
        <Typography>Cargando facturas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Facturas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra tus facturas y pagos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateInvoice}
          size="large"
        >
          Nueva Factura
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Facturado
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(totalAmount)}
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
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pagado
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(paidAmount)}
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
                    Pendiente
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(pendingAmount)}
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
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Vencido
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(overdueAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
              placeholder="Buscar facturas..."
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
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="draft">Borrador</MenuItem>
                <MenuItem value="sent">Enviada</MenuItem>
                <MenuItem value="paid">Pagada</MenuItem>
                <MenuItem value="overdue">Vencida</MenuItem>
                <MenuItem value="cancelled">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={dateFilter}
                label="Período"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="this_month">Este mes</MenuItem>
                <MenuItem value="last_month">Mes pasado</MenuItem>
                <MenuItem value="this_year">Este año</MenuItem>
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

      {/* Lista de facturas */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {filteredInvoices.map(renderInvoiceCard)}
        </Grid>
      ) : (
        renderInvoiceTable()
      )}

      {/* FAB para crear factura */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateInvoice}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo para ver factura completa */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Factura {selectedInvoice?.number}</Typography>
            <Box>
              <Tooltip title="Imprimir">
                <IconButton>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar PDF">
                <IconButton>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Enviar por email">
                <IconButton>
                  <EmailIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              {/* Información del cliente y proyecto */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Información del Cliente</Typography>
                  <Typography variant="body1"><strong>Nombre:</strong> {selectedInvoice.clientName}</Typography>
                  <Typography variant="body1"><strong>Email:</strong> {selectedInvoice.clientEmail}</Typography>
                  <Typography variant="body1"><strong>Proyecto:</strong> {selectedInvoice.projectName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Información de la Factura</Typography>
                  <Typography variant="body1"><strong>Número:</strong> {selectedInvoice.number}</Typography>
                  <Typography variant="body1"><strong>Fecha de emisión:</strong> {formatDate(selectedInvoice.issueDate)}</Typography>
                  <Typography variant="body1"><strong>Fecha de vencimiento:</strong> {formatDate(selectedInvoice.dueDate)}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      icon={statusIcons[selectedInvoice.status]}
                      label={statusLabels[selectedInvoice.status]} 
                      color={statusColors[selectedInvoice.status]}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Items de la factura */}
              <Typography variant="h6" gutterBottom>Detalles de la Factura</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio Unitario</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right"><strong>Subtotal:</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(selectedInvoice.subtotal)}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right"><strong>Impuestos:</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(selectedInvoice.tax)}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          <strong>{formatCurrency(selectedInvoice.total)}</strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Notas y términos de pago */}
              {(selectedInvoice.notes || selectedInvoice.paymentTerms) && (
                <Box sx={{ mt: 3 }}>
                  {selectedInvoice.paymentTerms && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Términos de pago:</strong> {selectedInvoice.paymentTerms}
                    </Typography>
                  )}
                  {selectedInvoice.notes && (
                    <Typography variant="body2">
                      <strong>Notas:</strong> {selectedInvoice.notes}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
          {selectedInvoice?.status === 'draft' && (
            <Button onClick={() => {
              if (selectedInvoice) handleSendInvoice(selectedInvoice);
              setOpenViewDialog(false);
            }} variant="contained" color="info">
              Enviar
            </Button>
          )}
          {(selectedInvoice?.status === 'sent' || selectedInvoice?.status === 'overdue') && (
            <Button onClick={() => {
              if (selectedInvoice) handleMarkAsPaid(selectedInvoice);
              setOpenViewDialog(false);
            }} variant="contained" color="success">
              Marcar como Pagada
            </Button>
          )}
          <Button onClick={() => {
            setOpenViewDialog(false);
            if (selectedInvoice) handleEditInvoice(selectedInvoice);
          }} variant="contained">
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear/editar factura */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Factura' : 'Crear Nueva Factura'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Factura"
                value={editingInvoice.number || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, number: e.target.value }))}
                disabled={isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Proyecto</InputLabel>
                <Select
                  value={editingInvoice.projectName || ''}
                  label="Proyecto"
                  onChange={(e) => {
                    const selectedProject = projects.find(p => p.name === e.target.value);
                    setEditingInvoice(prev => ({ 
                      ...prev, 
                      projectName: e.target.value,
                      clientName: selectedProject?.clientName || ''
                    }));
                  }}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.name}>
                      {project.name} - {project.clientName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cliente"
                value={editingInvoice.clientName || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email del Cliente"
                type="email"
                value={editingInvoice.clientEmail || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Emisión"
                type="date"
                value={editingInvoice.issueDate || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Vencimiento"
                type="date"
                value={editingInvoice.dueDate || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Términos de Pago"
                value={editingInvoice.paymentTerms || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, paymentTerms: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                multiline
                rows={3}
                value={editingInvoice.notes || ''}
                onChange={(e) => setEditingInvoice(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveInvoice} variant="contained">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la factura "{selectedInvoice?.number}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteInvoice} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}