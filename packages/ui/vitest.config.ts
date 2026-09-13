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
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.d.ts',
        'src/index.ts',
        'src/resolver-map.ts',
        'src/resolver.ts',
        'src/components/**/index.ts',
      ],
      // 光上报不拦截等于没有门禁：覆盖率掉到阈值以下直接让 CI 失败。
      // 阈值按当前实测值（约 87/75/87/89）留了 2~3 个点的余量。
      thresholds: {
        statements: 85,
        branches: 72,
        functions: 84,
        lines: 87,
      },
    },
  },
})
