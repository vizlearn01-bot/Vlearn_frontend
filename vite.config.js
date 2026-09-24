import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('katex') || id.includes('remark') || id.includes('rehype') || id.includes('react-markdown')) {
              return 'vendor-math';
            }
            if (id.includes('lucide-react') || id.includes('@headlessui') || id.includes('@heroicons')) {
              return 'vendor-ui';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/') || id.includes('/scheduler/')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
