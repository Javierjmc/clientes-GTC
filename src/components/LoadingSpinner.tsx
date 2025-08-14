import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Grid
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: number | string;
  message?: string;
  fullScreen?: boolean;
  variant?: 'spinner' | 'skeleton' | 'dots';
  color?: 'primary' | 'secondary' | 'inherit';
}

/**
 * Componente de carga reutilizable con diferentes variantes
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = 'Cargando...',
  fullScreen = false,
  variant = 'spinner',
  color = 'primary'
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{
              minHeight: fullScreen ? '100vh' : '200px',
              width: '100%'
            }}
          >
            <CircularProgress size={size} color={color} />
            {message && (
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        );

      case 'dots':
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{
              minHeight: fullScreen ? '100vh' : '200px',
              width: '100%'
            }}
          >
            <Box display="flex" gap={1}>
              {[0, 1, 2].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${index * 0.3}s`,
                    '@keyframes pulse': {
                      '0%, 80%, 100%': {
                        transform: 'scale(0)',
                        opacity: 0.5
                      },
                      '40%': {
                        transform: 'scale(1)',
                        opacity: 1
                      }
                    }
                  }}
                />
              ))}
            </Box>
            {message && (
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        );

      case 'skeleton':
        return (
          <Box sx={{ width: '100%', p: 2 }}>
            <Grid container spacing={2}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
                      <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                      <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return renderSpinner();
};

/**
 * Componente de skeleton para tablas
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header skeleton */}
      <Box display="flex" gap={2} mb={2}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            variant="text"
            width={`${100 / columns}%`}
            height={40}
          />
        ))}
      </Box>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={`row-${rowIndex}`} display="flex" gap={2} mb={1}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width={`${100 / columns}%`}
              height={32}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

/**
 * Componente de skeleton para cards
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 0.5 }} />
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="25%" height={20} />
              </Box>
              <Skeleton variant="rectangular" height={120} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Componente de skeleton para formularios
 */
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      {Array.from({ length: fields }).map((_, index) => (
        <Box key={index} mb={3}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      ))}
      <Box display="flex" gap={2} mt={4}>
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;