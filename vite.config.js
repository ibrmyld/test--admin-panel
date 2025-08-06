import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          query: ['@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'esnext',
    copyPublicDir: true
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    open: true
  },
  preview: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    strictPort: true,
    cors: true
  },
  esbuild: {
    target: 'esnext',
    platform: 'browser'
  }
})