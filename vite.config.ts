import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_API_BASE_URL in .env to proxy nothing and call your backend directly,
// or use the dev proxy below by leaving it empty and running the backend on :8000.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8000' } },
})
