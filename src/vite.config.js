import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Neexistuje žádná reference na router
  server: {
    port: 5173,
  }
})
