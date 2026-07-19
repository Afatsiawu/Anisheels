import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react-router-dom') ||
              id.includes('/react/') ||
              id.includes('/react-dom/')
            ) {
              return 'react';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('swiper')) {
              return 'swiper';
            }
          }
        },
      },
    },
  },
});