import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ FINAL FIX untuk Render: Abaikan file backend saat build
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'express',
        'pg',
        'dotenv',
        'pg-protocol',
        'pg-pool',
        'connect-pg-simple'
      ],
      input: 'index.html'
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
