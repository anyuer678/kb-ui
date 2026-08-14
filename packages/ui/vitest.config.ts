import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  define: { __KB_VERSION__: JSON.stringify(pkg.version) },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    passWithNoTests: true,
  },
})
