import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

// 视觉取样台直连 @kb/ui 源码（与 playground 一致，改组件即时生效），
// 因此同样需要注入 __KB_VERSION__ 常量，避免组件里读版本号时报未定义。
const uiPkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  root: fileURLToPath(new URL('./harness', import.meta.url)),
  define: { __KB_VERSION__: JSON.stringify(uiPkg.version) },
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5199,
    strictPort: true,
  },
  resolve: {
    alias: {
      'kb-ui-vue': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
})
