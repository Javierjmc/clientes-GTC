import React from 'react';
import { Grid, Box, Typography, Card, CardContent } from '@mui/material';
import { ChartWrapper, ChartData, useChartData } from './ChartWrapper';
import { formatCurrency, formatNumber } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * Props para gráficos de proyectos
 */
export interface ProjectChartsProps {
  projects: Array<{
    id: string;
    name: string;
    status: string;
    budget: number;
    spent: number;
    startDate: string;
    endDate?: string;
    client: string;
    progress: number;
  }>;
}

/**
 * Gráficos para reportes de proyectos
 */
export const ProjectCharts: React.FC<ProjectChartsProps> = ({ projects }) => {
  const { formatChartData } = useChartData();

  // Gráfico de estado de proyectos
  const statusData: ChartData = {
    labels: ['Activos', 'Completados', 'En Pausa', 'Cancelados'],
    datasets: [{
      label: 'Proyectos por Estado',
      data: [
        projects.filter(p => p.status === 'active').length,
        projects.filter(p => p.status === 'completed').length,
        projects.filter(p => p.status === 'paused').length,
        projects.filter(p => p.status === 'cancelled').length
      ],
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336']
    }]
  };

  // Gráfico de presupuesto vs gastado
  const budgetData = formatChartData(
    projects.slice(0, 10).map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
    [
      {
        label: 'Presupuesto',
        data: projects.slice(0, 10).map(p => p.budget),
        color: '#2196f3'
      },
      {
        label: 'Gastado',
        data: projects.slice(0, 10).map(p => p.spent),
        color: '#f44336'
      }
    ]
  );

  // Gráfico de progreso de proyectos
  const progressData = formatChartData(
    projects.filter(p => p.status === 'active').slice(0, 8).map(p => p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name),
    [{
      label: 'Progreso (%)',
      data: projects.filter(p => p.status === 'active').slice(0, 8).map(p => p.progress),
      color: '#4caf50'
    }]
  );

  // Gráfico de proyectos por cliente
  const clientStats = projects.reduce((acc, project) => {
    acc[project.client] = (acc[project.client] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clientData: ChartData = {
    labels: Object.keys(clientStats),
    datasets: [{
      label: 'Proyectos por Cliente',
      data: Object.values(clientStats),
      backgroundColor: [
        '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
        '#0288d1', '#689f38', '#fbc02d', '#e64a19', '#5d4037'
      ]
    }]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ChartWrapper
          type="pie"
          data={statusData}
          title="Estado de Proyectos"
          subtitle="Distribución actual de proyectos"
          height={300}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <ChartWrapper
          type="doughnut"
          data={clientData}
          title="Proyectos por Cliente"
          subtitle="Distribución de proyectos por cliente"
          height={300}
        />
      </Grid>
      
      <Grid item xs={12}>
        <ChartWrapper
          type="bar"
          data={budgetData}
          title="Presupuesto vs Gastado"
          subtitle="Comparación de presupuesto asignado y gastado por proyecto"
          height={400}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Monto ($)'
                }
              }
            },
            plugins: {
              tooltip: {
                enabled: true,
                mode: 'index',
                callbacks: {
                  label: (context: any) => {
                    return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                  }
                }
              }
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <ChartWrapper
          type="bar"
          data={progressData}
          title="Progreso de Proyectos Activos"
          subtitle="Porcentaje de completitud de proyectos en curso"
          height={350}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Progreso (%)'
                }
              }
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

/**
 * Props para gráficos financieros
 */
export interface FinancialChartsProps {
  invoices: Array<{
    id: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    client: string;
    createdAt: string;
  }>;
  expenses: Array<{
    id: string;
    amount: number;
    category: string;
    date: string;
    description: string;
  }>;
}

/**
 * Gráficos para reportes financieros
 */
export const FinancialCharts: React.FC<FinancialChartsProps> = ({ invoices, expenses }) => {
  const { formatChartData, createTimeSeriesData } = useChartData();

  // Gráfico de estado de facturas
  const invoiceStatusData: ChartData = {
    labels: ['Pagadas', 'Pendientes', 'Vencidas'],
    datasets: [{
      label: 'Facturas por Estado',
      data: [
        invoices.filter(i => i.status === 'paid').length,
        invoices.filter(i => i.status === 'pending').length,
        invoices.filter(i => i.status === 'overdue').length
      ],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336']
    }]
  };

  // Gráfico de ingresos vs gastos por mes
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    return date.toLocaleDateString('es-ES', { month: 'short' });
  });

  const monthlyIncome = months.map((_, monthIndex) => {
    return invoices
      .filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        return invoiceDate.getFullYear() === currentYear && 
               invoiceDate.getMonth() === monthIndex &&
               invoice.status === 'paid';
      })
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  });

  const monthlyExpenses = months.map((_, monthIndex) => {
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === currentYear && 
               expenseDate.getMonth() === monthIndex;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

  const incomeVsExpensesData = formatChartData(months, [
    {
      label: 'Ingresos',
      data: monthlyIncome,
      color: '#4caf50'
    },
    {
      label: 'Gastos',
      data: monthlyExpenses,
      color: '#f44336'
    }
  ]);

  // Gráfico de gastos por categoría
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseCategoryData: ChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      label: 'Gastos por Categoría',
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
        '#0288d1', '#689f38', '#fbc02d', '#e64a19', '#5d4037'
      ]
    }]
  };

  // Métricas resumen
  const totalIncome = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingIncome = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueIncome = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box>
      {/* Métricas resumen */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ingresos Totales
              </Typography>
              <Typography variant="h5" component="div" color="success.main">
                {formatCurrency(totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Gastos Totales
              </Typography>
              <Typography variant="h5" component="div" color="error.main">
                {formatCurrency(totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ingresos Pendientes
              </Typography>
              <Typography variant="h5" component="div" color="warning.main">
                {formatCurrency(pendingIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Facturas Vencidas
              </Typography>
              <Typography variant="h5" component="div" color="error.main">
                {formatCurrency(overdueIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartWrapper
            type="pie"
            data={invoiceStatusData}
            title="Estado de Facturas"
            subtitle="Distribución de facturas por estado"
            height={300}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ChartWrapper
            type="doughnut"
            data={expenseCategoryData}
            title="Gastos por Categoría"
            subtitle="Distribución de gastos por categoría"
            height={300}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((context.parsed * 100) / total).toFixed(1);
                      return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <ChartWrapper
            type="line"
            data={incomeVsExpensesData}
            title="Ingresos vs Gastos Mensuales"
            subtitle={`Comparación mensual del año ${currentYear}`}
            height={400}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Monto ($)'
                  }
                }
              },
              plugins: {
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    label: (context: any) => {
                      return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                    }
                  }
                }
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

/**
 * Props para gráficos de productividad
 */
export interface ProductivityChartsProps {
  tasks: Array<{
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee: string;
    createdAt: string;
    completedAt?: string;
    estimatedHours: number;
    actualHours?: number;
  }>;
  users: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
  }>;
}

/**
 * Gráficos para reportes de productividad
 */
export const ProductivityCharts: React.FC<ProductivityChartsProps> = ({ tasks, users }) => {
  const { formatChartData } = useChartData();

  // Gráfico de estado de tareas
  const taskStatusData: ChartData = {
    labels: ['Pendientes', 'En Progreso', 'Completadas', 'Canceladas'],
    datasets: [{
      label: 'Tareas por Estado',
      data: [
        tasks.filter(t => t.status === 'pending').length,
        tasks.filter(t => t.status === 'in_progress').length,
        tasks.filter(t => t.status === 'completed').length,
        tasks.filter(t => t.status === 'cancelled').length
      ],
      backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336']
    }]
  };

  // Gráfico de prioridad de tareas
  const taskPriorityData: ChartData = {
    labels: ['Baja', 'Media', 'Alta', 'Urgente'],
    datasets: [{
      label: 'Tareas por Prioridad',
      data: [
        tasks.filter(t => t.priority === 'low').length,
        tasks.filter(t => t.priority === 'medium').length,
        tasks.filter(t => t.priority === 'high').length,
        tasks.filter(t => t.priority === 'urgent').length
      ],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#9c27b0']
    }]
  };

  // Gráfico de productividad por usuario
  const userProductivity = users.map(user => {
    const userTasks = tasks.filter(t => t.assignee === user.name);
    const completedTasks = userTasks.filter(t => t.status === 'completed');
    return {
      name: user.name,
      total: userTasks.length,
      completed: completedTasks.length,
      productivity: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0
    };
  }).sort((a, b) => b.productivity - a.productivity).slice(0, 10);

  const productivityData = formatChartData(
    userProductivity.map(u => u.name.length > 12 ? u.name.substring(0, 12) + '...' : u.name),
    [{
      label: 'Productividad (%)',
      data: userProductivity.map(u => Math.round(u.productivity)),
      color: '#2196f3'
    }]
  );

  // Gráfico de horas estimadas vs reales
  const completedTasksWithHours = tasks.filter(t => t.status === 'completed' && t.actualHours);
  const hoursComparisonData = formatChartData(
    completedTasksWithHours.slice(0, 10).map(t => t.title.length > 15 ? t.title.substring(0, 15) + '...' : t.title),
    [
      {
        label: 'Horas Estimadas',
        data: completedTasksWithHours.slice(0, 10).map(t => t.estimatedHours),
        color: '#4caf50'
      },
      {
        label: 'Horas Reales',
        data: completedTasksWithHours.slice(0, 10).map(t => t.actualHours || 0),
        color: '#f44336'
      }
    ]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ChartWrapper
          type="pie"
          data={taskStatusData}
          title="Estado de Tareas"
          subtitle="Distribución actual de tareas"
          height={300}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <ChartWrapper
          type="doughnut"
          data={taskPriorityData}
          title="Prioridad de Tareas"
          subtitle="Distribución de tareas por prioridad"
          height={300}
        />
      </Grid>
      
      <Grid item xs={12}>
        <ChartWrapper
          type="bar"
          data={productivityData}
          title="Productividad por Usuario"
          subtitle="Porcentaje de tareas completadas por usuario"
          height={400}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Productividad (%)'
                }
              }
            }
          }}
        />
      </Grid>
      
      {completedTasksWithHours.length > 0 && (
        <Grid item xs={12}>
          <ChartWrapper
            type="bar"
            data={hoursComparisonData}
            title="Horas Estimadas vs Reales"
            subtitle="Comparación de tiempo estimado vs tiempo real en tareas completadas"
            height={400}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Horas'
                  }
                }
              },
              plugins: {
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              }
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default {
  ProjectCharts,
  FinancialCharts,
  ProductivityCharts
};