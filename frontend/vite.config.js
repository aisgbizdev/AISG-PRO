import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ FIX RENDER DEPLOY ERROR
// Abaikan semua modul backend saat build frontend
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['express', 'pg', 'dotenv', 'pg-protocol', 'pg-pool', 'connect-pg-simple'],
      input: 'index.html',
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
