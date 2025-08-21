import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // ⬇️ evita que esbuild intente pre-empaquetar TODOS los reexports de lucide-react
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // ⬇️ si haces SSR o Vercel lo interpreta como SSR/edge, descomenta esto:
  // ssr: {
  //   noExternal: ['lucide-react'],
  // },
})
