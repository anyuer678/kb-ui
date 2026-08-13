import prompts from 'prompts'

export interface CreateOptions {
  projectName: string
  template: 'base' | 'starter'
  packageManager: 'pnpm' | 'npm' | 'yarn'
  git: boolean
}

export async function promptMissing(options: Partial<CreateOptions>): Promise<CreateOptions> {
  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'projectName',
        message: '项目名称',
        initial: 'kb-app',
        validate: validateProjectName,
        skip: () => Boolean(options.projectName),
      },
      {
        type: 'select',
        name: 'template',
        message: '选择模板',
        choices: [
          { title: 'base - 最小可用', value: 'base' },
          { title: 'starter - 完整示例', value: 'starter' },
        ],
        skip: () => Boolean(options.template),
      },
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
      },
    ],
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
