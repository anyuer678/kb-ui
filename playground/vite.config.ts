import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: { port: 8070 },
  resolve: {
    alias: {
      '@kb/ui': fileURLToPath(new URL('../packages/ui/src/index.ts', import.meta.url)),
    },
  },
})
