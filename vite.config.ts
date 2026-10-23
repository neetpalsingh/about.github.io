import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base works for user sites (username.github.io) and project sites (/repo-name/)
export default defineConfig({
  plugins: [react()],
  base: './',
})
