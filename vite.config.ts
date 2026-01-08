import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure service worker is copied to dist
      input: {
        main: './index.html',
      },
    },
  },
  publicDir: 'public',
})
