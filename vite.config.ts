import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/duo-responsive-checker/',
  plugins: [react()],
})
