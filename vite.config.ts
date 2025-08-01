import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimiza el tamaño del bundle
    minify: 'terser',
    // Mejora la compatibilidad con Vercel
    sourcemap: false,
    // Asegura que los chunks sean de tamaño razonable
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/lab']
        }
      }
    }
  },
  // Asegura que el puerto esté disponible para Vercel
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173
  }
})
