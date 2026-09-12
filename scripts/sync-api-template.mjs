#!/usr/bin/env node
/**
 * 把 packages/api 的后端源码同步进 create-kb 的模板，保证全仓只有一份后端实现。
 *
 * 背景：`@kb/api` 是可复用的参考后端（Express + Zod），而 create-kb 的 api / fullstack
 * 模板原本各带一份几乎相同的后端拷贝，改一处就要改三处。本脚本以 `packages/api` 为唯一
 * 源，把源码铺进模板，两处只保留模板特有的入口文件。
 *
 * 同步规则
 *   packages/api/src/{app,server,query,types}.ts、middleware/**、routes/**、data/**
 *     → <target>/src/...（写入「自动生成」banner）
 *   packages/api/test/** → <target>/test/**
 *   src/index.ts 由本脚本生成（模板入口，端口默认 3000，与 docker-compose / web 代理一致）
 *   src/start.ts 不复制（那是 @kb/api 包自身的启动入口）
 *
 * 用法
 *   node scripts/sync-api-template.mjs            # 写入模板
 *   node scripts/sync-api-template.mjs --check    # 只校验是否与源一致，有漂移则 exit 1
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, relative, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = join(rootDir, 'packages', 'api')

/** 模板目标：都从 packages/api 取源码 */
const targets = [
  join(rootDir, 'packages', 'create-kb', 'templates', 'api'),
  join(rootDir, 'packages', 'create-kb', 'templates', 'fullstack', 'server'),
]

/** 不从 @kb/api 复制的文件（模板有自己的入口） */
const EXCLUDED = new Set(['src/index.ts', 'src/start.ts'])

const BANNER = [
  '/* eslint-disable */',
  '// ⚠️ 自动生成文件，请勿直接修改。',
  '// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。',
  '',
].join('\n')

/** 模板入口：端口 3000（docker-compose / web 代理约定），服务名带上项目名前缀 */
const INDEX_TS = `import { startServer } from './server'

/** 模板入口：端口默认 3000（与 docker-compose、web 代理保持一致），可用 PORT 覆盖 */
const port = Number(process.env.PORT ?? 3000)

startServer({ port, name: '{{projectName}}-api' }).catch((error: unknown) => {
  console.error('[api] 启动失败:', error)
  process.exitCode = 1
})
`

/** 递归收集相对路径（posix 风格，便于跨平台比对） */
function walk(dir, base = dir) {
  const result = []
  if (!existsSync(dir)) return result
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...walk(full, base))
    else result.push(relative(base, full).split(sep).join('/'))
  }
  return result
}

/** 计算某个目标目录应有的全部文件：相对路径 → 文件内容 */
function expectedFiles() {
  const files = new Map()

  const srcFiles = walk(join(sourceRoot, 'src')).filter((rel) => !EXCLUDED.has(`src/${rel}`))
  for (const rel of srcFiles) {
    const raw = readFileSync(join(sourceRoot, 'src', rel), 'utf-8')
    files.set(`src/${rel}`, `${BANNER}${raw}`)
  }

  for (const rel of walk(join(sourceRoot, 'test'))) {
    const raw = readFileSync(join(sourceRoot, 'test', rel), 'utf-8')
    files.set(`test/${rel}`, `${BANNER}${raw}`)
  }

  files.set('src/index.ts', INDEX_TS)
  return files
}

function run(mode) {
  const files = expectedFiles()
  const problems = []

  for (const target of targets) {
    const label = relative(rootDir, target).split(sep).join('/')

    for (const [rel, content] of files) {
      const dest = join(target, rel.split('/').join(sep))
      const current = existsSync(dest) ? readFileSync(dest, 'utf-8') : null

      if (current === content) continue
      problems.push(`${label}/${rel}${current === null ? '（缺失）' : '（内容不一致）'}`)
      if (mode === 'write') {
        mkdirSync(dirname(dest), { recursive: true })
        writeFileSync(dest, content, 'utf-8')
      }
    }

    // 目标里多出来的 .ts 文件视为残留（例如模板旧版的 items.ts），一并清理
    for (const rel of walk(join(target, 'src'))) {
      if (files.has(`src/${rel}`)) continue
      const full = join(target, 'src', rel.split('/').join(sep))
      problems.push(`${label}/src/${rel}（多余文件）`)
      if (mode === 'write') rmSync(full)
    }
    for (const rel of walk(join(target, 'test'))) {
      if (files.has(`test/${rel}`)) continue
      const full = join(target, 'test', rel.split('/').join(sep))
      problems.push(`${label}/test/${rel}（多余文件）`)
      if (mode === 'write') rmSync(full)
    }
  }

  if (mode === 'check') {
    if (problems.length > 0) {
      console.error('✖ 模板与 packages/api 不一致，请运行 `pnpm sync:api-template`：')
      for (const item of problems) console.error(`  - ${item}`)
      process.exit(1)
    }
    console.log('✓ create-kb 模板与 packages/api 保持一致')
    return
  }

  if (problems.length === 0) {
    console.log('✓ 模板已是同步状态，无需改动')
    return
  }
  console.log(`✓ 已同步模板（共 ${problems.length} 处变更）：`)
  for (const item of problems) console.log(`  - ${item}`)
}

run(process.argv.includes('--check') ? 'check' : 'write')
