import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbContextMenu from '../ContextMenu.vue'
import type { ContextMenuItem } from '../ContextMenu.vue'

const stubTeleport = { global: { stubs: { teleport: true } } }

const ITEMS: ContextMenuItem[] = [
  { key: 'copy', label: '复制' },
  { key: 'paste', label: '粘贴' },
  { key: 'delete', label: '删除', divided: true },
  { key: 'rename', label: '重命名', disabled: true },
]

function mountMenu(props: Record<string, unknown> = {}) {
  return mount(KbContextMenu, {
    props: { items: ITEMS, ...props },
    slots: { default: '<div class="area">右键区域</div>' },
    ...stubTeleport,
  })
}

/** 在根容器上模拟右键 */
async function openAt(wrapper: ReturnType<typeof mountMenu>, x = 100, y = 200) {
  await wrapper.find('.kb-contextmenu').trigger('contextmenu', { clientX: x, clientY: y })
}

describe('KbContextMenu', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('渲染默认插槽内容', () => {
    const wrapper = mountMenu()
    expect(wrapper.find('.area').text()).toBe('右键区域')
    expect(wrapper.find('.kb-contextmenu__panel').exists()).toBe(false)
  })

  it('右键打开菜单并派发 open', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)

    expect(wrapper.find('.kb-contextmenu__panel').exists()).toBe(true)
    expect(wrapper.emitted('open')).toHaveLength(1)
    expect(wrapper.findAll('.kb-contextmenu__item')).toHaveLength(4)
  })

  it('菜单出现在鼠标位置', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper, 120, 240)
    const style = wrapper.find('.kb-contextmenu__panel').attributes('style') ?? ''
    expect(style).toContain('left: 120px')
    expect(style).toContain('top: 240px')
  })

  it('菜单带 menu 语义，禁用项标注 aria-disabled', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)
    expect(wrapper.find('.kb-contextmenu__panel').attributes('role')).toBe('menu')

    const last = wrapper.findAll('.kb-contextmenu__item')[3]
    expect(last.attributes('aria-disabled')).toBe('true')
    expect(last.classes()).toContain('kb-contextmenu__item--disabled')
  })

  it('divided 项带分隔线类名', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)
    expect(wrapper.findAll('.kb-contextmenu__item')[2].classes()).toContain('kb-contextmenu__item--divided')
  })

  it('点击菜单项派发 select 并关闭', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)

    await wrapper.findAll('.kb-contextmenu__item')[0].trigger('click')
    await nextTick()

    expect(wrapper.emitted('select')![0]).toEqual(['copy'])
    expect(wrapper.find('.kb-contextmenu__panel').exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击禁用项不派发 select', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)
    await wrapper.findAll('.kb-contextmenu__item')[3].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('disabled 时右键不打开', async () => {
    const wrapper = mountMenu({ disabled: true })
    await openAt(wrapper)
    expect(wrapper.find('.kb-contextmenu__panel').exists()).toBe(false)
    expect(wrapper.emitted('open')).toBeUndefined()
  })

  it('点击页面其他位置关闭', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击菜单内部不关闭', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)

    await wrapper.find('.kb-contextmenu__panel').trigger('click')
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.find('.kb-contextmenu__panel').exists()).toBe(true)
  })

  it('Esc 关闭菜单', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('暴露 close 方法', async () => {
    const wrapper = mountMenu()
    await openAt(wrapper)

    ;(wrapper.vm as unknown as { close: () => void }).close()
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('视口右下方溢出时反向修正位置', async () => {
    // jsdom 里所有元素尺寸都是 0，只有给菜单面板造出真实宽高才能触发翻转逻辑
    const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isPanel = this.classList?.contains('kb-contextmenu__panel')
      return {
        width: isPanel ? 200 : 0,
        height: isPanel ? 300 : 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect
    })

    const wrapper = mountMenu()
    // jsdom 视口默认 1024x768：从 (900,700) 弹出会向右下溢出
    await openAt(wrapper, 900, 700)
    await nextTick()

    const style = wrapper.find('.kb-contextmenu__panel').attributes('style') ?? ''
    expect(style).toContain('left: 820px')
    expect(style).toContain('top: 464px')

    spy.mockRestore()
  })

  it('卸载时移除 document 监听', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const wrapper = mountMenu()
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
