import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Full URL from .env
  const fullUrl = env.ALLOWED_HOST;
  const host = new URL(fullUrl).hostname;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
    },
    preview: {
      allowedHosts: [host],
    },
  };
});
