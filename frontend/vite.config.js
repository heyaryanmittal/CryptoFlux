import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charting: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
