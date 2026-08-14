import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

// playground 直连 @kb/ui 源码，需同步注入版本常量（与 packages/ui 构建一致）
const uiPkg = JSON.parse(
  readFileSync(new URL('../packages/ui/package.json', import.meta.url), 'utf-8'),
)

export default defineConfig({
  define: { __KB_VERSION__: JSON.stringify(uiPkg.version) },
  plugins: [vue()],
  server: { port: 8070 },
  resolve: {
    alias: {
      '@kb/ui': fileURLToPath(new URL('../packages/ui/src/index.ts', import.meta.url)),
    },
  },
})
