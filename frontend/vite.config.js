// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Konfigurasi Vite khusus SPA (SSR dimatikan)
// dan pastikan modul server tidak ikut di-bundle.
export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public',
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173, strictPort: true },
  build: {
    ssr: false,            // <— ini mematikan build SSR
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Jangan pernah bundle modul backend
      external: ['express', 'pg', 'pg-pool', 'pg-protocol', 'pg-types']
    }
  },
  optimizeDeps: {
    exclude: ['express', 'pg', 'pg-pool', 'pg-protocol', 'pg-types']
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
})
