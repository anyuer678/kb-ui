/**
 * 无障碍（a11y）测试
 *
 * 两层断言：
 *   1. 结构性断言：关键角色（role）与 ARIA 属性必须存在且语义正确
 *   2. axe-core 扫描：用 axe 兜底，捕捉「角色组合非法」「缺少可访问名称」等
 *      人工容易漏掉的问题
 *
 * 说明：
 *   - jsdom 没有真实布局与绘制，`color-contrast` 之类的规则无意义，统一关闭；
 *   - Teleport 类浮层（ContextMenu）**不 stub teleport**：stub 会导致节点被重建，
 *     聚焦断言拿到的元素已经不在文档里。真实 teleport 到 body 后，用
 *     `document.activeElement` 断言才准确。
 */
import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import axe from 'axe-core'
import { h, nextTick } from 'vue'
import {
  KbAutoComplete,
  KbContextMenu,
  KbImage,
  KbImagePreview,
  KbSplitter,
  KbTimePicker,
  KbTour,
  KbTreeSelect,
} from '../index'

const AXE_OPTIONS = {
  rules: {
    // 需要真实布局 / 绘制，jsdom 下无意义
    'color-contrast': { enabled: false },
    // 组件单测渲染的是孤立片段，不构成完整页面地标结构
    region: { enabled: false },
  },
}

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

function mountAttached(component: unknown, options: Record<string, unknown> = {}): VueWrapper {
  wrapper = mount(component as never, {
    attachTo: document.body,
    // Teleport 的浮层统一就地渲染，便于断言
    global: { stubs: { teleport: true } },
    ...options,
  })
  return wrapper
}

/**
 * axe-core 的类型声明是 `export = axe` 且带多个重载（含「回调式返回 void」的版本），
 * 直接把参数断言成 never 会让 TS 选中回调重载，于是 `results` 被判成 void。
 * 这里显式收敛成 Promise 形态。
 */
type AxeRun = (
  context: Element,
  options: unknown,
) => Promise<{ violations: { id: string; help: string; nodes: unknown[] }[] }>
const runAxe = axe.run as unknown as AxeRun

/** 跑一遍 axe，返回可读的违规列表 */
async function axeViolations(el: Element): Promise<string[]> {
  const results = await runAxe(el, AXE_OPTIONS)
  return results.violations.map((v) => `${v.id}: ${v.help}（${v.nodes.length} 处）`)
}

/** 派发一次文档级键盘事件（组件把监听挂在 document / window 上） */
async function pressKey(key: string): Promise<void> {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  await nextTick()
}

/** 当前获得焦点元素的可见文本，用于断言「焦点落在哪一项」 */
function focusedText(): string | undefined {
  return document.activeElement?.textContent?.trim()
}

describe('a11y — Splitter', () => {
  it('分隔条是带可访问名称的 separator，并暴露当前比例与键盘焦点', async () => {
    const local = mountAttached(KbSplitter, {
      props: { modelValue: [40, 60] },
      slots: { 'panel-0': () => h('div', 'A'), 'panel-1': () => h('div', 'B') },
    })
    const bar = local.find('[role="separator"]')
    expect(bar.exists()).toBe(true)
    // 关键：可聚焦的元素仅靠 role 不够，必须有可访问名称
    expect(bar.attributes('aria-label')).toBeTruthy()
    expect(bar.attributes('aria-orientation')).toBe('vertical')
    expect(bar.attributes('aria-valuenow')).toBe('40')
    expect(bar.attributes('aria-valuemin')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('100')
    expect(bar.attributes('tabindex')).toBe('0')
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})

describe('a11y — AutoComplete', () => {
  it('输入框是 combobox，展开后 aria-controls 指向真实存在的候选列表', async () => {
    const local = mountAttached(KbAutoComplete, {
      props: { options: [{ value: 'apple', label: 'Apple' }] },
    })
    const input = local.find('input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')
    expect(input.attributes('aria-expanded')).toBe('false')

    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    // aria-controls 不能是悬空引用：它指向的元素必须真的渲染出来
    const controls = input.attributes('aria-controls') as string
    expect(controls).toBeTruthy()
    expect(document.getElementById(controls)).toBeTruthy()
    expect(local.find('[role="listbox"]').exists()).toBe(true)
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})

describe('a11y — TreeSelect', () => {
  it('触发器是带名称的 combobox，展开后 aria-controls 指向下拉树', async () => {
    const local = mountAttached(KbTreeSelect, {
      props: { options: [{ value: 'a', label: 'A' }] },
    })
    const trigger = local.find('[role="combobox"]')
    expect(trigger.exists()).toBe(true)
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-label')).toBeTruthy()
    expect(trigger.attributes('aria-controls')).toBeTruthy()

    await trigger.trigger('click')
    await nextTick()

    expect(trigger.attributes('aria-expanded')).toBe('true')
    const controls = trigger.attributes('aria-controls') as string
    expect(document.getElementById(controls)).toBeTruthy()
    expect(local.find('[role="tree"]').exists()).toBe(true)
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})

describe('a11y — TimePicker', () => {
  it('选择器是带名称的 combobox，展开后各列是带名称的 listbox', async () => {
    const local = mountAttached(KbTimePicker)
    const trigger = local.find('[role="combobox"]')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    // ARIA 1.2 规定 combobox 必须带 aria-label 与 aria-controls
    expect(trigger.attributes('aria-label')).toBeTruthy()
    expect(trigger.attributes('aria-controls')).toBeTruthy()

    await trigger.trigger('click')
    await nextTick()
    await nextTick()

    expect(trigger.attributes('aria-expanded')).toBe('true')
    const columns = local.findAll('[role="listbox"]')
    expect(columns.length).toBeGreaterThan(0)
    for (const column of columns) {
      expect(column.attributes('aria-label')).toBeTruthy()
    }
    const options = local.findAll('[role="option"]')
    expect(options.length).toBeGreaterThan(0)
    expect(options[0].attributes('aria-selected')).toBeDefined()
    expect(await axeViolations(local.element as Element)).toEqual([])
  })

  it('关闭状态下同样没有 axe 违规', async () => {
    const local = mountAttached(KbTimePicker)
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})

describe('a11y — Image', () => {
  it('图片有 alt，预览遮罩提供 button 角色与可访问名称', async () => {
    const local = mountAttached(KbImage, { props: { src: '/x.png', alt: '示例图' } })
    expect(local.find('img').attributes('alt')).toBe('示例图')
    const mask = local.find('[role="button"]')
    expect(mask.exists()).toBe(true)
    expect(mask.attributes('aria-label')).toBeTruthy()
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})

describe('a11y — ContextMenu', () => {
  const ITEMS = [
    { key: 'copy', label: '复制' },
    { key: 'paste', label: '粘贴' },
    { key: 'delete', label: '删除', disabled: true },
  ]

  /** 不 stub teleport：菜单真实挂到 body 上，才能用 document.activeElement 断言焦点 */
  function mountMenu(): VueWrapper {
    wrapper = mount(KbContextMenu, {
      props: { items: ITEMS },
      attachTo: document.body,
      slots: { default: () => h('div', '右键区域') },
    })
    return wrapper
  }

  async function openMenu(local: VueWrapper): Promise<void> {
    await local.trigger('contextmenu', { clientX: 20, clientY: 20 })
    await nextTick()
    await nextTick()
  }

  it('菜单有可访问名称，菜单项具备 menuitem 语义', async () => {
    const local = mountMenu()
    await openMenu(local)

    const menu = document.querySelector('[role="menu"]')
    expect(menu).toBeTruthy()
    expect(menu?.getAttribute('aria-label')).toBeTruthy()

    const items = Array.from(document.querySelectorAll('[role="menuitem"]'))
    expect(items.length).toBe(3)
    // 菜单项要能被程序化聚焦，同时不进入 Tab 序列
    for (const item of items) expect(item.getAttribute('tabindex')).toBe('-1')
    expect(await axeViolations(document.body)).toEqual([])
  })

  it('打开后焦点移入菜单，方向键在可选项之间移动且跳过禁用项', async () => {
    const local = mountMenu()
    await openMenu(local)

    // 打开即聚焦第一项，键盘用户才能真正操作菜单
    expect(focusedText()).toBe('复制')

    await pressKey('ArrowDown')
    expect(focusedText()).toBe('粘贴')

    // 再按一次已到最后一个可选项：禁用项「删除」不可获得焦点
    await pressKey('ArrowDown')
    expect(focusedText()).toBe('粘贴')

    await pressKey('ArrowUp')
    expect(focusedText()).toBe('复制')

    await pressKey('End')
    expect(focusedText()).toBe('粘贴')

    await pressKey('Home')
    expect(focusedText()).toBe('复制')
  })

  it('Esc 关闭菜单', async () => {
    const local = mountMenu()
    await openMenu(local)
    expect(document.querySelector('[role="menu"]')).toBeTruthy()

    await pressKey('Escape')
    expect(document.querySelector('[role="menu"]')).toBeNull()
  })
})

describe('a11y — Tour', () => {
  it('气泡是带名称的模态对话框，且支持 Esc 关闭', async () => {
    const local = mountAttached(KbTour, {
      props: { modelValue: true, steps: [{ title: '第一步', description: '说明' }] },
    })
    await nextTick()

    const bubble = local.find('[role="dialog"]')
    expect(bubble.exists()).toBe(true)
    expect(bubble.attributes('aria-modal')).toBe('true')
    // role=dialog 必须有可访问名称，否则 axe 报 aria-dialog-name
    expect(bubble.attributes('aria-label')).toBe('第一步')
    expect(await axeViolations(local.element as Element)).toEqual([])

    await pressKey('Escape')
    expect(local.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('步骤没有标题时回退到语言包里的通用名称', async () => {
    const local = mountAttached(KbTour, {
      props: { modelValue: true, steps: [{ title: '' }] },
    })
    await nextTick()
    expect(local.find('[role="dialog"]').attributes('aria-label')).toBe('引导')
  })
})

describe('a11y — ImagePreview', () => {
  it('预览浮层是带名称的模态对话框', async () => {
    const local = mountAttached(KbImagePreview, {
      props: { visible: true, images: [{ src: '/a.png', alt: 'A' }] },
    })
    await nextTick()

    const dialog = local.find('[role="dialog"]')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-label')).toBe('图片预览')
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})

describe('a11y — 组合场景整体扫描', () => {
  it('多个组件同时挂载时没有 axe 违规', async () => {
    const local = mountAttached(KbSplitter, {
      props: { modelValue: [50, 50] },
      slots: {
        'panel-0': () => [h(KbAutoComplete, { options: [{ value: 'a', label: 'A' }] }), h(KbTimePicker)],
        'panel-1': () => h(KbImage, { src: '/b.png', alt: 'B' }),
      },
    })
    expect(await axeViolations(local.element as Element)).toEqual([])
  })
})
