import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vite hanya build frontend, abaikan backend module seperti express
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['express', 'pg', 'dotenv'], // <== ini penting
      input: 'index.html'
    },
  },
  server: {
    host: true,
    port: 5173
  }
})
