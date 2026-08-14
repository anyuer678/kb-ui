import { Command } from 'commander'
import { promptMissing, validateProjectName, type CreateOptions } from './prompts'
import { createProject } from './create'

const program = new Command()

program
  .name('create-kb')
  .description('创建一个预装 @kb/ui 的 Vue 3 + Vite + TypeScript 项目')
  .version('0.1.0')
  .argument('[project-name]', '项目名称')
  .option('--template <template>', '模板：base（最小）| starter（完整示例）', 'base')
  .option('--no-git', '不初始化 git 仓库')
  .option('-p, --package-manager <pm>', '包管理器：pnpm | npm | yarn', 'pnpm')
  .action(async (projectName?: string) => {
    const cliOptions = program.opts()

    // 校验位置参数（若提供）
    if (projectName !== undefined) {
      const result = validateProjectName(projectName)
      if (result !== true) {
        console.error(`✖ ${result}`)
        process.exit(1)
      }
    }

    const validTemplates: CreateOptions['template'][] = ['base', 'starter', 'api', 'fullstack', 'electron', 'react', 'ai']
    const template = validTemplates.includes(cliOptions.template as CreateOptions['template'])
      ? (cliOptions.template as CreateOptions['template'])
      : 'base'
    if (cliOptions.template !== template) {
      console.warn(`⚠ 未知模板 ${cliOptions.template}，使用默认模板 base`)
    }
    const pm = cliOptions.packageManager
    const pmValid = pm === 'pnpm' || pm === 'npm' || pm === 'yarn'
    if (!pmValid) {
      console.error('✖ 包管理器必须是 pnpm、npm 或 yarn')
      process.exit(1)
    }

    const options: CreateOptions = await promptMissing({
      projectName,
      template,
      packageManager: pm as CreateOptions['packageManager'],
      git: cliOptions.git,
    })

    await createProject(options)
  })

program.parse()
