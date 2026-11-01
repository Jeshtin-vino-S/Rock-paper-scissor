import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Full URL from .env
  const fullUrl = env.ALLOWED_HOST || 'https://rock-paper-scissor-cs3w.onrender.com/';
  const host = new URL(fullUrl).hostname;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
    },
    preview: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
      allowedHosts: [host],
    },
  };
});
