import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // ⬇️ Tambahkan baris ini agar Vite tidak ikut build express/backend
      external: ['express', 'pg', 'dotenv'],
      input: 'index.html'
    },
  },
  server: {
    port: 5173,
    host: true
  }
})
