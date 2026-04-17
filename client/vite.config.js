/**
 * @file client/vite.config.js
 * @description Vite configuration with API proxy and optimized chunking.
 * Proxies all /api/* requests to the Express server at port 5000.
 * Splits vendor libraries into separate chunks for better caching.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/storage'],
          charts: ['recharts'],
          ui: ['@headlessui/react', 'react-hot-toast', 'react-dropzone'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
