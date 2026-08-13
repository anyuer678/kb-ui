import { mkdirSync, readdirSync, copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const pkgRoot = join(import.meta.dirname, '..')
const srcDir = join(pkgRoot, 'src/components')
const stylesDir = join(pkgRoot, 'src/styles')
const outDir = join(pkgRoot, 'dist/styles')

mkdirSync(outDir, { recursive: true })

let count = 0
// 按组件样式：src/components/<Name>/style.css → dist/styles/<Name>.css
for (const name of readdirSync(srcDir)) {
  const style = join(srcDir, name, 'style.css')
  if (existsSync(style)) {
    copyFileSync(style, join(outDir, `${name}.css`))
    count++
  }
}
// 全量样式：src/styles/*.css → dist/styles/
for (const file of readdirSync(stylesDir)) {
  if (file.endsWith('.css')) {
    copyFileSync(join(stylesDir, file), join(outDir, file))
    count++
  }
}

console.log(`component styles copied to dist/styles (${count} files)`)
