import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ FINAL FIX FOR RENDER – FULLY WORKING VERSION (CLIENT-ONLY BUILD)
// -----------------------------------------------------------
// Render hanya perlu membuild frontend, bukan folder server/
// Jadi kita arahkan build hanya ke file index.html di root proyek.
export default defineConfig({
  plugins: [react()],
  root: '.', // root project
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // ⛔️ Abaikan semua file backend & Node-only modules
      external: [
        'express',
        'pg',
        'dotenv',
        'pg-protocol',
        'pg-pool',
        'connect-pg-simple',
        'body-parser',
        'cookie-parser',
        'cors',
        'path',
        'fs',
        'url'
      ],
      input: 'index.html'
    },
    // ⛔️ Nonaktifkan SSR sepenuhnya
    ssr: false,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: [
      'express',
      'pg',
      'dotenv',
      'connect-pg-simple'
    ]
  }
})
