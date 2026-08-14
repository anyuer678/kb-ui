import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { toPackageName, type CreateOptions } from './prompts'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** 模板根目录：tsup 打包后 dist/ 与 templates/ 同级 */
function templatesRoot(): string {
  // 开发时：packages/create-kb/src → packages/create-kb/templates
  // 打包后：dist/index.js → packages/create-kb/templates
  return join(__dirname, '../templates')
}

/** 读取 create-kb 依赖的 @kb/ui 版本（发布配套版本） */
function kbVersion(): string {
  const require = createRequire(import.meta.url)
  try {
    const pkg = require('@kb/ui/package.json') as { version: string }
    return pkg.version
  } catch {
    console.warn('⚠ 未读取到 @kb/ui 版本，模板将使用 "latest" 作为依赖版本')
    return 'latest'
  }
}

const PLACEHOLDER_EXTENSIONS = new Set([
  '.json', '.ts', '.vue', '.html', '.md', '.js', '.mjs', '.css', '.gitignore', '.yml', '.yaml',
])

function shouldReplace(fileName: string): boolean {
  // .gitignore 无扩展名但需要替换
  if (fileName === '.gitignore') return true
  const ext = fileName.slice(fileName.lastIndexOf('.'))
  return PLACEHOLDER_EXTENSIONS.has(ext)
}

function replacePlaceholders(filePath: string, options: CreateOptions, version: string): void {
  const content = readFileSync(filePath, 'utf-8')
  const replaced = content
    .replaceAll('{{projectName}}', options.projectName)
    .replaceAll('{{packageName}}', toPackageName(options.projectName))
    .replaceAll('{{kbVersion}}', version)
  if (replaced !== content) {
    writeFileSync(filePath, replaced, 'utf-8')
  }
}

function walkAndReplace(dir: string, options: CreateOptions, version: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkAndReplace(full, options, version)
    } else if (shouldReplace(entry.name)) {
      replacePlaceholders(full, options, version)
    }
  }
}

export async function createProject(options: CreateOptions): Promise<void> {
  const targetDir = join(process.cwd(), options.projectName)
  const templateDir = join(templatesRoot(), options.template)

  if (!existsSync(templateDir)) {
    console.error(`✖ 模板不存在：${options.template}`)
    process.exit(1)
  }

  if (existsSync(targetDir)) {
    const entries = readdirSync(targetDir)
    if (entries.length > 0) {
      console.error(`✖ 目标目录 ${targetDir} 已存在且非空，请选择其他项目名或删除该目录`)
      process.exit(1)
    }
  } else {
    mkdirSync(targetDir, { recursive: true })
  }

  console.log(`\n创建项目 ${options.projectName}（模板：${options.template}）...`)
  cpSync(templateDir, targetDir, { recursive: true })

  const version = kbVersion()
  walkAndReplace(targetDir, options, version)

  if (options.git) {
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' })
    } catch {
      console.warn('⚠ git init 失败（未安装 git？），已跳过，不影响项目创建')
    }
  }

  console.log(`\n✔ 项目创建完成：${targetDir}\n`)
  console.log('下一步：')
  console.log(`  cd ${options.projectName}`)
  console.log(`  ${options.packageManager} install`)
  console.log(`  ${options.packageManager} run dev\n`)
}
