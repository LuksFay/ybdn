import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import apiRoutes from './plugins/api-routes.js'

export default defineConfig({
  plugins: [react(), apiRoutes()],
})
