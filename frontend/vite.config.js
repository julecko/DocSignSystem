import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ASSET_URL = process.env.ASSET_URL || '';

export default defineConfig({
  plugins: [react()],
  base: `${ASSET_URL}/`,
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});