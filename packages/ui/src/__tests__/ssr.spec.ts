// @vitest-environment node
/**
 * SSR 冒烟测试
 *
 * 组件库里的 Affix / Anchor / BackTop / ImagePreview / Splitter / Tour / ContextMenu /
 * TimePicker / TreeSelect / AutoComplete / Dialog / Dropdown / Popconfirm / Select
 * 都会直接访问 `window` / `document`。这些访问必须有守卫（`typeof window !== 'undefined'`
 * 或放在 onMounted 里），否则在 Node 端 renderToString 时会直接抛
 * `ReferenceError: window is not defined`。
 *
 * 这里在 **node 环境**（没有 window / document）下把所有 Kb* 组件渲染一遍，
 * 任何未守卫的 DOM 访问都会在这里炸出来。
 */
import { describe, it, expect } from 'vitest'
import { createSSRApp, h, type Component } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as KB from '../index'

/** 判断一个导出值是否是可渲染的 Vue 组件 */
function isComponent(value: unknown): value is Component {
  if (typeof value === 'function') return true
  return typeof value === 'object' && value !== null && ('render' in value || 'setup' in value)
}

/** 收集所有以 Kb 开头的组件导出（新增组件会自动纳入覆盖） */
const entries: [string, Component][] = Object.entries(KB as Record<string, unknown>)
  .filter(([name, value]) => name.startsWith('Kb') && name[2] === name[2]?.toUpperCase() && isComponent(value))
  .map(([name, value]) => [name, value as Component])

/**
 * 少数组件没有 prop 就无法渲染（会读 `props.x.y`），给它一份最小可渲染的默认值。
 * 只在这一处集中维护，避免把断言分散到各个用例里。
 */
const MINIMAL_PROPS: Record<string, Record<string, unknown>> = {
  KbAnchor: { items: [] },
  KbAutoComplete: { options: [] },
  KbBreadcrumb: { items: [] },
  KbCalendar: { modelValue: '2026-09-13' },
  KbCascader: { options: [] },
  KbCollapse: { items: [] },
  KbContextMenu: { items: [] },
  KbDescriptions: { items: [] },
  KbDropdown: { items: [] },
  KbGrid: {},
  KbList: { items: [] },
  KbSegmented: { options: [] },
  KbSelect: { options: [] },
  KbStatistic: { title: '统计', value: 0 },
  KbSteps: { steps: [] },
  KbTable: { columns: [], data: [] },
  KbTabs: { tabs: [] },
  KbTimeline: { items: [] },
  KbTour: { steps: [] },
  KbTransfer: { data: [], modelValue: [] },
  KbTree: { data: [] },
  KbTreeSelect: { options: [] },
  KbWatermark: { text: 'kb-ui' },
}

describe('SSR 冒烟测试（node 环境，无 window/document）', () => {
  it('至少收集到 60 个组件（防止过滤逻辑失效导致空跑）', () => {
    expect(entries.length).toBeGreaterThanOrEqual(60)
  })

  it.each(entries)('%s 可以在 SSR 下渲染而不抛错', async (name, component) => {
    const props = MINIMAL_PROPS[name] ?? {}
    const app = createSSRApp({ render: () => h(component, props) })
    const html = await renderToString(app)
    expect(typeof html).toBe('string')
  })

  it('渲染结果确实包含标记（不是全部空输出）', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(KB.KbButton, null, () => 'KB') }))
    expect(html).toContain('kb-button')
    expect(html).toContain('KB')
  })

  it('ConfigProvider 在 SSR 下能注入全局配置', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(KB.KbConfigProvider, { locale: 'en-US' }, () => h(KB.KbEmpty)),
      }),
    )
    expect(html).toContain('kb-empty')
  })
})
