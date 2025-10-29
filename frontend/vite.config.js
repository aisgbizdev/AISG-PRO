import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Konfigurasi aman untuk build frontend tanpa ganggu server
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Abaikan module backend saat proses build frontend
      external: ['express', 'pg', 'dotenv'],
      input: 'index.html'
    },
  },
  server: {
    host: true,
    port: 5173
  }
})
