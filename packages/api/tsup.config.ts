import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm', 'cjs'],
  // 只为库入口产出类型（cli 是脚本，不需要 .d.ts）
  dts: { entry: 'src/index.ts' },
  clean: true,
  splitting: false,
  sourcemap: true,
})
