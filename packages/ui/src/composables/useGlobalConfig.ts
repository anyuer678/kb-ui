/**
 * 全局配置（ConfigProvider）注入键与读取
 *
 * 组件不直接从本模块读取具体值，而是统一走 useGlobalConfig()，
 * 未包裹 ConfigProvider 时返回各字段的兜底默认值。
 */
import { inject, provide, toRef, type InjectionKey, type Ref } from 'vue'
import { defaultLocale, getLocale, type ProjectLocale } from '../locale'
import type { LocalePath } from '../locale/types'

/** 组件统一尺寸 */
export type ComponentSize = 'small' | 'medium' | 'large'

/** 主题模式 */
export type ThemeMode = 'light' | 'dark'

/** 全局配置结构 */
export interface GlobalConfig {
  /** 语言包 */
  locale: ProjectLocale
  /** 组件默认尺寸 */
  size: ComponentSize
  /** 弹层基础层级，实际层级在此基础上累加 */
  zIndex: number
  /** 主题模式 */
  theme: ThemeMode
}

export const defaultGlobalConfig: GlobalConfig = {
  locale: defaultLocale,
  size: 'medium',
  zIndex: 2000,
  theme: 'light',
}

export const configKey = Symbol('kb-global-config') as InjectionKey<GlobalConfig>

/** 由 ConfigProvider 调用，向其子树注入配置 */
export function provideGlobalConfig(config: GlobalConfig): void {
  provide(configKey, config)
}

/** 读取全局配置，未包裹 ConfigProvider 时返回默认配置 */
export function useGlobalConfig(): GlobalConfig {
  return inject(configKey, defaultGlobalConfig)
}

/** 读取当前尺寸，允许组件自身的 size prop 优先覆盖 */
export function useSize(local?: ComponentSize): ComponentSize {
  if (local) return local
  return useGlobalConfig().size
}

/** 读取弹层基础层级 */
export function useZIndex(): number {
  return useGlobalConfig().zIndex
}

export type Translate = (path: LocalePath, ...args: unknown[]) => string

/**
 * 读取语言包与取值函数
 *
 * 组件内置文案一律走 t()，这样 ConfigProvider 只需换 locale 即可整站切换语言。
 *
 * 两个返回值的响应式语义：
 * - `t` 每次调用时才读取当前语言包，因此可安全地在 computed / 模板中使用，
 *   ConfigProvider 切换语言后会自动重渲染；
 * - `locale` 是 ref，读取具体字段需写 `locale.value.xxx`（同样具备响应性）。
 */
export function useLocale(): { t: Translate; locale: Ref<ProjectLocale> } {
  const config = useGlobalConfig()
  const locale = toRef(config, 'locale') as unknown as Ref<ProjectLocale>

  const t: Translate = (path, ...args) => {
    const current = locale.value ?? defaultLocale
    const raw = lookup(current, path)
    const value = raw == null ? lookup(defaultLocale, path) : raw
    if (typeof value !== 'string') return path
    return args.length ? fill(value, args) : value
  }

  return { t, locale }
}

function lookup(locale: ProjectLocale, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, locale)
}

function fill(template: string, args: unknown[]): string {
  let i = 0
  return template.replace(/%s/g, () => String(args[i++] ?? ''))
}

/** 按名称解析语言包，未知名称回退到默认语言 */
export { getLocale }
