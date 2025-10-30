import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Konfigurasi build frontend tanpa ganggu backend
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // 🚫 Abaikan modul server saat build
      external: ['express', 'pg', 'dotenv'],
      input: 'index.html',
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
