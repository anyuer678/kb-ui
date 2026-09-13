/**
 * 按需引入 resolver
 *
 * 供 `unplugin-vue-components` 使用，让使用方无需手写 import：
 *
 * ```ts
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import { KbResolver } from 'kb-ui-vue/resolver'
 *
 * export default defineConfig({
 *   plugins: [vue(), Components({ resolvers: [KbResolver()] })],
 * })
 * ```
 *
 * 解析模板里出现的 `<KbButton />`，自动补上
 * `import { KbButton } from 'kb-ui-vue'` 与对应的样式引入，
 * 从而实现组件 + 样式的双重按需加载。
 */
import { styleEntryMap } from './resolver-map'

/** resolver 的解析结果，结构对齐 unplugin-vue-components */
export interface KbComponentResolveResult {
  /** 从 `from` 中导入的具名导出 */
  name: string
  /** 组件来源包 */
  from: string
  /** 随之引入的副作用（样式文件） */
  sideEffects?: string | string[]
}

/** unplugin-vue-components 的 ComponentResolver 结构子集 */
export interface KbComponentResolver {
  type: 'component'
  resolve: (name: string) => KbComponentResolveResult | undefined
}

export interface KbResolverOptions {
  /**
   * 组件名前缀，默认 `'Kb'`。
   * 传入后只有以该前缀开头的标签才会被解析，避免与其他库冲突。
   */
  prefix?: string | string[]
  /**
   * 是否自动引入组件样式，默认 `true`。
   * 关闭时需自行 `import 'kb-ui-vue/styles/index.css'`。
   */
  importStyle?: boolean
}

/**
 * 创建按需引入 resolver
 *
 * 组件名到「样式入口」的映射见 resolver-map.ts —— 由脚本从
 * `src/components/*` 目录与 `dist/styles/*.css` 生成，新增组件后需同步更新。
 */
export function KbResolver(options: KbResolverOptions = {}): KbComponentResolver {
  const { prefix = 'Kb', importStyle = true } = options
  const prefixes = Array.isArray(prefix) ? prefix : [prefix]

  return {
    type: 'component',
    resolve(name: string): KbComponentResolveResult | undefined {
      const base = stripPrefix(name, prefixes)
      if (!base) return undefined

      // 不在组件清单内的标签（如使用方自定义的 KbFoo）不处理
      if (!(base in styleEntryMap)) return undefined

      const styleEntry = styleEntryMap[base]
      // 统一映射回包内真实导出的名字（`Kb` + 基础名），
      // 这样即使使用方自定义了前缀（如 `<KBInput>`）也能正确导入
      const result: KbComponentResolveResult = { name: `Kb${base}`, from: 'kb-ui-vue' }
      if (importStyle && styleEntry) {
        result.sideEffects = [`kb-ui-vue/styles/${styleEntry}.css`]
      }
      return result
    },
  }
}

/** 命中任一前缀则去掉它，未命中返回 undefined */
function stripPrefix(name: string, prefixes: string[]): string | undefined {
  for (const prefix of prefixes) {
    if (prefix && name.startsWith(prefix) && name.length > prefix.length) {
      return name.slice(prefix.length)
    }
  }
  return undefined
}

export { styleEntryMap }
export default KbResolver
