import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'universal-dialog': path.resolve(__dirname, '../../src'),
    },
  },
  server: {
    port: 5173,
  },
})
