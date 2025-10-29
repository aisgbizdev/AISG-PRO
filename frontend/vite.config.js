// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['express'], // ⬅️ tambahkan ini
    },

  // Jalankan hanya SPA (no SSR)
  build: {
    ssr: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Pastikan entry cuma index.html (jangan auto scan file lain)
      input: path.resolve(process.cwd(), 'index.html'),

      // Abaikan modul/modul server sepenuhnya
      external: [
        'express',
        'pg', 'pg-pool', 'pg-protocol', 'pg-types',
        // abaikan semua file/folder di bawah /server
        // (regex cocok ke path absolute seperti /opt/render/.../server/...)
        /\/server\/.*/i
      ]
    }
  },

  // Jangan pre-bundle hal-hal server
  optimizeDeps: {
    exclude: ['express', 'pg', 'pg-pool', 'pg-protocol', 'pg-types']
  },

  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173, strictPort: true },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
