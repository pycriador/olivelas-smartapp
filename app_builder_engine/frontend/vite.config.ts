import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Determina a porta do backend lendo o arquivo de porta dinâmico ou variável de ambiente
const backendPortFile = path.resolve(__dirname, '../.backend_port');
let backendPort = process.env.BACKEND_PORT;
if (!backendPort && fs.existsSync(backendPortFile)) {
  try {
    backendPort = fs.readFileSync(backendPortFile, 'utf-8').trim();
  } catch {
    // fallback
  }
}
if (!backendPort) {
  backendPort = '8000';
}

const isProd = process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production';
const frontendPort = parseInt(process.env.PORT || '5173', 10);
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  envDir: path.resolve(__dirname, '../..'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@loft/react-loft': path.resolve(__dirname, './src/lib/loft-copan/components.tsx'),
      '@loft/react-icons': path.resolve(__dirname, './src/lib/loft-copan/icons.tsx'),
      '@loft/tokens-loft': path.resolve(__dirname, './src/lib/loft-copan/tokens.ts'),
    },
  },
  build: {
    outDir: process.env.VITE_OUT_DIR || '../app/static/dist',
    emptyOutDir: true,
  },
  server: {
    port: frontendPort,
    strictPort: isProd,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
      },
      '/static/assets': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
      },
      '/generated_apps': {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: frontendPort,
    strictPort: true,
  },
});
