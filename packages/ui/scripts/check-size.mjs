/**
 * 产物体积预算检查
 *
 * 组件库最容易「悄悄变胖」：加一个组件、引入一个工具函数，几十 KB 就上去了，
 * 而没有任何测试会失败。这个脚本把体积变成硬门禁：
 *
 *   1. 检查 dist 各入口的 raw / gzip 体积是否超出预算
 *   2. 验证 tree-shaking：单独引入一个组件时，打包结果必须远小于全量包
 *      （如果不能摇树，按需引入就是假的）
 *
 * 零新增依赖：esbuild 从 vite 的 pnpm 虚拟 store 里按需解析，找不到就跳过第 2 项。
 *
 * 用法：
 *   node scripts/check-size.mjs            # 检查，超预算则 exit 1
 *   node scripts/check-size.mjs --update   # 只打印当前体积（用来定预算）
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgDir = path.resolve(__dirname, '..')
const distDir = path.join(pkgDir, 'dist')
const onlyReport = process.argv.includes('--update')

/** 体积预算（KB）。调高之前请先想清楚：这个增长值不值。 */
const BUDGETS = [
  { file: 'index.js', raw: 180, gzip: 45, note: 'ESM 全量入口' },
  { file: 'index.cjs', raw: 180, gzip: 45, note: 'CJS 全量入口' },
  { file: 'resolver.js', raw: 8, gzip: 4, note: '按需引入解析器' },
]

/** 单独引一个组件时，打包结果允许占全量包的比例上限 */
const TREE_SHAKING_MAX_RATIO = 0.25

const kb = (bytes) => bytes / 1024
const fmt = (bytes) => `${kb(bytes).toFixed(1)} KB`
const gzipSize = (buf) => zlib.gzipSync(buf, { level: 9 }).length

let failed = false
const rows = []

for (const budget of BUDGETS) {
  const file = path.join(distDir, budget.file)
  if (!fs.existsSync(file)) {
    rows.push({ name: budget.file, status: 'MISSING', detail: '产物不存在，请先构建', ok: false })
    failed = true
    continue
  }
  const buf = fs.readFileSync(file)
  const rawKb = kb(buf.length)
  const gzipKb = kb(gzipSize(buf))
  const okRaw = onlyReport || rawKb <= budget.raw
  const okGzip = onlyReport || gzipKb <= budget.gzip
  const ok = okRaw && okGzip
  if (!ok) failed = true
  rows.push({
    name: budget.file,
    status: ok ? 'PASS' : 'FAIL',
    detail: `${fmt(buf.length)} / gzip ${fmt(gzipSize(buf))}  (预算 ≤ ${budget.raw} / ${budget.gzip} KB)  ${budget.note}`,
    ok,
  })
}

/** 从 pnpm 虚拟 store 里解析 esbuild（不作为直接依赖） */
async function resolveEsbuild() {
  try {
    return await import('esbuild')
  } catch {
    /* 继续回退 */
  }
  const pnpmDir = path.resolve(pkgDir, '../../node_modules/.pnpm')
  if (!fs.existsSync(pnpmDir)) return null
  const candidates = fs
    .readdirSync(pnpmDir)
    .filter((d) => d.startsWith('esbuild@'))
    .sort()
    .reverse()
  for (const dir of candidates) {
    const main = path.join(pnpmDir, dir, 'node_modules', 'esbuild', 'lib', 'main.js')
    if (!fs.existsSync(main)) continue
    try {
      const mod = await import(pathToFileURL(main).href)
      return mod.default ?? mod
    } catch {
      /* 换下一个版本 */
    }
  }
  return null
}

const entryFile = path.join(distDir, 'index.js')
if (fs.existsSync(entryFile)) {
  const esbuild = await resolveEsbuild()
  if (!esbuild) {
    rows.push({
      name: 'tree-shaking',
      status: 'SKIP',
      detail: '未找到 esbuild，跳过（装一次 vite 依赖即可恢复）',
      ok: true,
    })
  } else {
    try {
      const result = await esbuild.build({
        stdin: {
          // 用相对路径 + resolveDir：esbuild 不接受 file:// 形式的 import specifier
          contents: `import { KbButton } from './dist/index.js'\nconsole.log(KbButton)`,
          resolveDir: pkgDir,
          loader: 'js',
        },
        bundle: true,
        format: 'esm',
        minify: true,
        write: false,
        logLevel: 'silent',
        // vue 是 peerDependency，不计入库自身体积
        external: ['vue'],
      })
      const single = result.outputFiles[0].contents
      const full = fs.readFileSync(entryFile)
      const ratio = single.length / full.length
      const ok = onlyReport || ratio <= TREE_SHAKING_MAX_RATIO
      if (!ok) failed = true
      rows.push({
        name: 'tree-shaking',
        status: ok ? 'PASS' : 'FAIL',
        detail:
          `只引入 KbButton 打包后 ${fmt(single.length)}，占全量包 ${(ratio * 100).toFixed(1)}%` +
          `（上限 ${(TREE_SHAKING_MAX_RATIO * 100).toFixed(0)}%）`,
        ok,
      })
    } catch (err) {
      failed = true
      rows.push({ name: 'tree-shaking', status: 'FAIL', detail: `打包失败：${err.message}`, ok: false })
    }
  }
}

const width = Math.max(...rows.map((r) => r.status.length))
console.log('\n产物体积预算检查\n' + '='.repeat(72))
for (const row of rows) {
  console.log(`${row.status.padEnd(width)}  ${row.name}`)
  console.log(`${' '.repeat(width)}  ${row.detail}`)
}
console.log('='.repeat(72))

if (onlyReport) {
  console.log('（--update 模式：只报告，不判定）\n')
} else if (failed) {
  console.error('❌ 体积检查未通过：请确认新增代码是否必要，或调整 BUDGETS 预算。\n')
  process.exit(1)
} else {
  console.log('✅ 体积检查通过\n')
}
