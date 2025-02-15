import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Changed port to 3001
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
