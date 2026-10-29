import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A porta 5173 precisa coincidir com CORS_ORIGIN do backend.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
