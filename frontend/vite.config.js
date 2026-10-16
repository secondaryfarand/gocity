import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Mengarahkan semua request '/api' ke server Express lokal
      '/api': 'http://localhost:5000'
    }
  }
})
