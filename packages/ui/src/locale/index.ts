/**
 * 语言包注册与取值
 *
 * 组件内部一律通过 composables/useLocale 的 t() 取文案，
 * 不直接引用具体语言包，以便被 ConfigProvider 的 locale 覆盖。
 */
import { enUS } from './en-US'
import { zhCN } from './zh-CN'
import type { LocalePath, ProjectLocale } from './types'

/** 已内置的语言包 */
export const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
} satisfies Record<string, ProjectLocale>

export type LocaleName = keyof typeof locales

/** 未显式配置 ConfigProvider 时使用的语言 */
export const defaultLocale: ProjectLocale = zhCN

/** 按名称获取语言包，未知名称回退到默认语言 */
export function getLocale(name?: string): ProjectLocale {
  if (!name) return defaultLocale
  return (locales as Record<string, ProjectLocale>)[name] ?? defaultLocale
}

/** 按点号路径取值，路径不存在返回 undefined */
function lookup(locale: ProjectLocale, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, locale)
}

/** 依次把 %s 替换为入参 */
function fill(template: string, args: unknown[]): string {
  let i = 0
  return template.replace(/%s/g, () => String(args[i++] ?? ''))
}

/**
 * 创建取值函数
 *
 * - 传入的属性缺失时回退到默认语言包（防止第三方自定义包漏字段导致空白）
 * - 支持 `%s` 占位符，按入参顺序替换
 * - 路径完全不存在时返回路径本身，便于开发期发现问题
 */
export function createTranslate(locale: ProjectLocale) {
  return function t(path: LocalePath, ...args: unknown[]): string {
    const raw = lookup(locale, path)
    const fallback = raw == null ? lookup(defaultLocale, path) : raw
    if (typeof fallback !== 'string') return path
    return args.length ? fill(fallback, args) : fallback
  }
}

export { enUS, zhCN }
export type { LocalePath, ProjectLocale }
