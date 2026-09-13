/**
 * 生成 Volar 全局组件类型声明（dist/global.d.ts）
 *
 * 使用方在 tsconfig 中引入后，模板里写 `<KbButton />` 也能获得类型提示与补全：
 *
 * ```json
 * { "compilerOptions": { "types": ["kb-ui-vue/global"] } }
 * ```
 *
 * 组件清单直接从 src/components/* / index.ts 解析，避免手工维护漏项。
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(here, '..')
const componentsDir = resolve(pkgRoot, 'src/components')
const outFile = resolve(pkgRoot, 'dist/global.d.ts')

/** 从组件目录的 index.ts 中提取对外导出的组件名 */
function collectExports(indexFile) {
  const src = readFileSync(indexFile, 'utf8')
  const names = []
  for (const match of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const raw of match[1].split(',')) {
      const token = raw.trim()
      if (!token) continue
      const aliased = token.match(/^\S+\s+as\s+(\S+)$/)
      names.push(aliased ? aliased[1] : token)
    }
  }
  return names
}

const exported = []
for (const entry of readdirSync(componentsDir, { withFileTypes: true }).sort((a, b) =>
  a.name.localeCompare(b.name),
)) {
  if (!entry.isDirectory()) continue
  const indexFile = resolve(componentsDir, entry.name, 'index.ts')
  if (existsSync(indexFile)) exported.push(...collectExports(indexFile))
}

const componentNames = [...new Set(exported)]
  .filter((name) => /^[A-Z]/.test(name))
  .map((name) => `Kb${name}`)
  .sort()

const lines = componentNames.map((name) => `    ${name}: typeof KB.${name}`)
const banner = `/* eslint-disable */
/* 由 scripts/build-global-types.mjs 自动生成，请勿手动修改 */
`

const content = `${banner}import type * as KB from './index'

declare module 'vue' {
  export interface GlobalComponents {
${lines.join('\n')}
  }
}

export {}
`

writeFileSync(outFile, content, 'utf8')
console.log(`global component types written to dist/global.d.ts (${componentNames.length} components)`)
