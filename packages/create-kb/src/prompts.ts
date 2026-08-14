import prompts, { type PromptObject } from 'prompts'

// @types/prompts 长期缺失 skip 选项类型（prompts 官方支持）
type PromptItem = PromptObject & { skip?: () => boolean }

export interface CreateOptions {
  projectName: string
  template: 'base' | 'starter' | 'api' | 'fullstack' | 'electron'
  packageManager: 'pnpm' | 'npm' | 'yarn'
  git: boolean
}

export async function promptMissing(options: Partial<CreateOptions>): Promise<CreateOptions> {
  // 非交互模式：所有必填选项已提供时，直接返回（避免在非 TTY 环境触发 prompts）
  if (options.projectName && options.template && options.packageManager) {
    return {
      projectName: options.projectName,
      template: options.template,
      packageManager: options.packageManager,
      git: options.git ?? true,
    }
  }

  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'projectName',
        message: '项目名称',
        initial: 'kb-app',
        validate: validateProjectName,
        skip: () => Boolean(options.projectName),
      } satisfies PromptItem,
      {
        type: 'select',
        name: 'template',
        message: '选择模板',
        choices: [
          { title: 'base - 最小可用', value: 'base' },
          { title: 'starter - 完整示例', value: 'starter' },
          { title: 'api - Express 后端服务', value: 'api' },
          { title: 'fullstack - 前端+API+Docker', value: 'fullstack' },
          { title: 'electron - 桌面应用', value: 'electron' },
        ],
        skip: () => Boolean(options.template),
      } satisfies PromptItem,
      {
        type: 'select',
        name: 'packageManager',
        message: '包管理器',
        choices: [
          { title: 'pnpm', value: 'pnpm' },
          { title: 'npm', value: 'npm' },
          { title: 'yarn', value: 'yarn' },
        ],
        skip: () => Boolean(options.packageManager),
      } satisfies PromptItem,
    ] as unknown as PromptObject[],
    { onCancel: () => process.exit(1) },
  )

  return {
    projectName: options.projectName ?? answers.projectName,
    template: options.template ?? answers.template,
    packageManager: options.packageManager ?? answers.packageManager,
    git: options.git ?? true,
  }
}

export function validateProjectName(name: string): string | boolean {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    return '项目名只能包含小写字母、数字和连字符（-），且不能以连字符开头'
  }
  return true
}

/** 项目名 → npm 包名（项目名已经是合法 npm 名，直接返回） */
export function toPackageName(name: string): string {
  return name
}
