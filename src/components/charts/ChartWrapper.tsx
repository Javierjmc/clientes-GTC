import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  PolarAreaController
} from 'chart.js';
import {
  Chart,
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
  Radar
} from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  PolarAreaController
);

/**
 * Tipos de gráficos disponibles
 */
export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar';

/**
 * Configuración de datos para gráficos
 */
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
    [key: string]: any;
  }>;
}

/**
 * Opciones de configuración para gráficos
 */
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    title?: {
      display: boolean;
      text: string;
      font?: {
        size: number;
        weight: string;
      };
    };
    legend?: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled: boolean;
      mode?: 'index' | 'dataset' | 'point' | 'nearest';
      intersect?: boolean;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      grid?: {
        display: boolean;
      };
    };
    y?: {
      display: boolean;
      beginAtZero: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      grid?: {
        display: boolean;
      };
    };
  };
  animation?: {
    duration: number;
    easing: string;
  };
  interaction?: {
    intersect: boolean;
    mode: 'index' | 'dataset' | 'point' | 'nearest';
  };
}

/**
 * Props del componente ChartWrapper
 */
export interface ChartWrapperProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
  className?: string;
  sx?: any;
  onChartClick?: (event: any, elements: any[]) => void;
  onDatasetClick?: (datasetIndex: number, dataIndex: number) => void;
}

/**
 * Colores predefinidos para gráficos
 */
export const chartColors = {
  primary: [
    '#1976d2', '#1565c0', '#0d47a1', '#42a5f5', '#64b5f6',
    '#90caf9', '#bbdefb', '#e3f2fd'
  ],
  success: [
    '#2e7d32', '#1b5e20', '#388e3c', '#4caf50', '#66bb6a',
    '#81c784', '#a5d6a7', '#c8e6c9'
  ],
  warning: [
    '#f57c00', '#e65100', '#ff9800', '#ffb74d', '#ffcc02',
    '#ffd54f', '#ffe082', '#ffecb3'
  ],
  error: [
    '#d32f2f', '#c62828', '#b71c1c', '#f44336', '#e57373',
    '#ef5350', '#ffcdd2', '#ffebee'
  ],
  info: [
    '#0288d1', '#0277bd', '#01579b', '#03a9f4', '#29b6f6',
    '#4fc3f7', '#81d4fa', '#b3e5fc'
  ],
  gradient: [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ]
};

/**
 * Componente wrapper para gráficos con configuración automática
 */
export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  data,
  options = {},
  title,
  subtitle,
  height = 400,
  width,
  className,
  sx,
  onChartClick,
  onDatasetClick
}) => {
  const theme = useTheme();
  const chartRef = useRef<ChartJS>(null);

  // Configuración por defecto basada en el tema
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!title,
        text: title || '',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: type === 'pie' || type === 'doughnut' || type === 'polarArea' || type === 'radar' ? undefined : {
      x: {
        display: true,
        grid: {
          display: theme.palette.mode === 'light'
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          display: theme.palette.mode === 'light'
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Combinar opciones por defecto con las proporcionadas
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    },
    onClick: onChartClick ? (event: any, elements: any[]) => {
      onChartClick(event, elements);
      if (onDatasetClick && elements.length > 0) {
        const element = elements[0];
        onDatasetClick(element.datasetIndex, element.index);
      }
    } : undefined
  };

  // Aplicar colores automáticamente si no están definidos
  const processedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || (
        type === 'pie' || type === 'doughnut' || type === 'polarArea'
          ? chartColors.gradient
          : chartColors.primary[index % chartColors.primary.length]
      ),
      borderColor: dataset.borderColor || (
        type === 'line'
          ? chartColors.primary[index % chartColors.primary.length]
          : 'transparent'
      ),
      borderWidth: dataset.borderWidth || (type === 'line' ? 2 : 1),
      tension: dataset.tension || (type === 'line' ? 0.4 : 0),
      fill: dataset.fill !== undefined ? dataset.fill : (type === 'line' ? false : true)
    }))
  };

  // Renderizar el gráfico según el tipo
  const renderChart = () => {
    const commonProps = {
      ref: chartRef,
      data: processedData,
      options: mergedOptions,
      height,
      width
    };

    switch (type) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'polarArea':
        return <PolarArea {...commonProps} />;
      case 'radar':
        return <Radar {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  return (
    <Paper
      className={className}
      sx={{
        p: 2,
        height: height + 80,
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
      elevation={1}
    >
      {(title || subtitle) && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {title && (
            <Typography variant="h6" component="h3" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ flex: 1, position: 'relative', minHeight: height }}>
        {renderChart()}
      </Box>
    </Paper>
  );
};

/**
 * Hook para obtener datos de gráfico formateados
 */
export const useChartData = () => {
  const theme = useTheme();

  const formatChartData = (
    labels: string[],
    datasets: Array<{
      label: string;
      data: number[];
      color?: string;
      type?: 'bar' | 'line';
    }>
  ): ChartData => {
    return {
      labels,
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.color || chartColors.primary[index % chartColors.primary.length],
        borderColor: dataset.color || chartColors.primary[index % chartColors.primary.length],
        borderWidth: dataset.type === 'line' ? 2 : 1,
        tension: dataset.type === 'line' ? 0.4 : 0,
        fill: dataset.type === 'line' ? false : true
      }))
    };
  };

  const createTimeSeriesData = (
    data: Array<{ date: string; value: number; label?: string }>,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): ChartData => {
    // Agrupar datos por período
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.date);
      let key: string;
      
      switch (groupBy) {
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      acc[key].total += item.value;
      acc[key].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const labels = Object.keys(grouped).sort();
    const values = labels.map(key => grouped[key].total);

    return formatChartData(labels, [{
      label: 'Valor',
      data: values
    }]);
  };

  return {
    formatChartData,
    createTimeSeriesData,
    chartColors
  };
};

export default ChartWrapper;