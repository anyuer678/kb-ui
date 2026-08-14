import { mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const pkgRoot = join(import.meta.dirname, '..')
const srcDir = join(pkgRoot, 'src/components')
const stylesDir = join(pkgRoot, 'src/styles')
const outDir = join(pkgRoot, 'dist/styles')

mkdirSync(outDir, { recursive: true })

let count = 0
const componentCss = []

// 按组件样式：src/components/<Name>/style.css → dist/styles/<Name>.css
for (const name of readdirSync(srcDir)) {
  const style = join(srcDir, name, 'style.css')
  if (existsSync(style)) {
    copyFileSync(style, join(outDir, `${name}.css`))
    componentCss.push(readFileSync(style, 'utf-8'))
    count++
  }
}

// 基础样式：src/styles/*.css → dist/styles/（index.css 稍后重新生成全量）
for (const file of readdirSync(stylesDir)) {
  if (file.endsWith('.css') && file !== 'index.css') {
    copyFileSync(join(stylesDir, file), join(outDir, file))
    count++
  }
}

// 全量样式入口 index.css = tokens + dark + 全部组件样式（顺序保证 token 先定义）
const tokens = readFileSync(join(stylesDir, 'tokens.css'), 'utf-8')
const dark = readFileSync(join(stylesDir, 'dark.css'), 'utf-8')
writeFileSync(join(outDir, 'index.css'), `${tokens}\n${dark}\n${componentCss.join('\n')}`)
count++

console.log(`component styles copied to dist/styles (${count} files)`)
