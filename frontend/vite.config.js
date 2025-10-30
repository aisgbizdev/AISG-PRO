import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ FINAL FIX — cegah Vite ikut baca file backend
export default defineConfig({
  root: './',          // Pastikan build mulai dari frontend
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
      // ⛔ Abaikan semua modul backend
      external: [
        'express',
        'pg',
        'dotenv',
        'pg-protocol',
        'pg-pool',
        'connect-pg-simple'
      ]
    }
  },
  server: {
    host: true,
    port: 5173
  }
})
