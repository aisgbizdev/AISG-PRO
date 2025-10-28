import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: 'server/index.ts', // ganti sesuai path file server utama
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'server/index.ts'
    }
  }
})
