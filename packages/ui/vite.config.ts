import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  define: { __KB_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    vue(),
    dts({
      include: ['src'],
      exclude: ['**/__tests__/**'],
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      // resolver 单独出包：它会被 vite.config.ts 在 Node 侧加载，
      // 与主入口分离可避免把 Vue 相关依赖拖进构建配置
      entry: {
        index: 'src/index.ts',
        resolver: 'src/resolver.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
    },
    rollupOptions: { external: ['vue'], output: { exports: 'named' } },
    cssCodeSplit: true,
  },
})
