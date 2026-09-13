import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbSplitter from '../Splitter.vue'

const RECT = {
  left: 0,
  top: 0,
  width: 1000,
  height: 1000,
  right: 1000,
  bottom: 1000,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect

function mountSplitter(props: Record<string, unknown> = {}) {
  return mount(KbSplitter, {
    props: { modelValue: [50, 50], ...props },
    slots: { 'panel-0': '<span class="a">A</span>', 'panel-1': '<span class="b">B</span>' },
  })
}

/** 把根容器尺寸固定下来，方便换算拖拽比例 */
function stubRect(wrapper: ReturnType<typeof mountSplitter>): void {
  ;(wrapper.find('.kb-splitter').element as HTMLElement).getBoundingClientRect = () => RECT
}

describe('KbSplitter', () => {
  it('按 modelValue 长度渲染面板与分隔条', () => {
    const wrapper = mountSplitter({ modelValue: [30, 40, 30] })
    expect(wrapper.findAll('.kb-splitter__pane')).toHaveLength(3)
    expect(wrapper.findAll('.kb-splitter__bar')).toHaveLength(2)
  })

  it('面板占比写入 flex-basis', () => {
    const wrapper = mountSplitter({ modelValue: [30, 70] })
    const panes = wrapper.findAll('.kb-splitter__pane')
    expect(panes[0].attributes('style')).toContain('flex-basis: 30%')
    expect(panes[1].attributes('style')).toContain('flex-basis: 70%')
  })

  it('默认横向排列，vertical 切换类名与分隔条方向', () => {
    const horizontal = mountSplitter()
    expect(horizontal.find('.kb-splitter').classes()).toContain('kb-splitter--horizontal')
    expect(horizontal.find('.kb-splitter__bar').attributes('aria-orientation')).toBe('vertical')

    const vertical = mountSplitter({ layout: 'vertical' })
    expect(vertical.find('.kb-splitter').classes()).toContain('kb-splitter--vertical')
    expect(vertical.find('.kb-splitter__bar').attributes('aria-orientation')).toBe('horizontal')
  })

  it('分隔条暴露无障碍取值', () => {
    const wrapper = mountSplitter({ modelValue: [35, 65] })
    const bar = wrapper.find('.kb-splitter__bar')
    expect(bar.attributes('role')).toBe('separator')
    expect(bar.attributes('tabindex')).toBe('0')
    expect(bar.attributes('aria-valuenow')).toBe('35')
    expect(bar.attributes('aria-valuemin')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('100')
  })

  it('方向键按 2% 步进调整相邻面板', async () => {
    const wrapper = mountSplitter({ modelValue: [50, 50] })
    await wrapper.find('.kb-splitter__bar').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[52, 48]])
  })

  it('反向键减少占比', async () => {
    const wrapper = mountSplitter({ modelValue: [50, 50] })
    await wrapper.find('.kb-splitter__bar').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[48, 52]])
  })

  it('键盘调整同样受 min 限制', async () => {
    const wrapper = mountSplitter({ modelValue: [95, 5], min: 10 })
    await wrapper.find('.kb-splitter__bar').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[90, 10]])
  })

  it('vertical 布局使用上下方向键', async () => {
    const wrapper = mountSplitter({ layout: 'vertical', modelValue: [50, 50] })
    await wrapper.find('.kb-splitter__bar').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[52, 48]])

    await wrapper.find('.kb-splitter__bar').trigger('keydown', { key: 'ArrowLeft' })
    // 横向键在纵向布局下不生效
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('拖拽按鼠标位置换算相邻面板占比', async () => {
    const wrapper = mountSplitter({ modelValue: [50, 50] })
    stubRect(wrapper)

    await wrapper.find('.kb-splitter__bar').trigger('mousedown', { clientX: 500 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))
    await nextTick()

    // 容器宽 1000，鼠标在 300 → 左侧面板 30%
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[30, 70]])
  })

  it('拖拽时只影响两侧面板，其余保持', async () => {
    const wrapper = mountSplitter({ modelValue: [20, 30, 50] })
    stubRect(wrapper)

    // 拖第二个分隔条（下标 1），其前面已占 20%
    await wrapper.findAll('.kb-splitter__bar')[1].trigger('mousedown', { clientX: 500 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 600 }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[20, 40, 40]])
  })

  it('拖拽不会超出 min 边界', async () => {
    const wrapper = mountSplitter({ modelValue: [50, 50], min: 20 })
    stubRect(wrapper)

    await wrapper.find('.kb-splitter__bar').trigger('mousedown', { clientX: 500 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[20, 80]])
  })

  it('disabled 时忽略拖拽', async () => {
    const wrapper = mountSplitter({ modelValue: [50, 50], disabled: true })
    stubRect(wrapper)

    await wrapper.find('.kb-splitter__bar').trigger('mousedown', { clientX: 500 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.kb-splitter__bar').classes()).toContain('kb-splitter__bar--disabled')
  })

  it('mouseup 结束拖拽后移动不再产生更新', async () => {
    const wrapper = mountSplitter({ modelValue: [50, 50] })
    stubRect(wrapper)

    await wrapper.find('.kb-splitter__bar').trigger('mousedown', { clientX: 500 })
    document.dispatchEvent(new MouseEvent('mouseup'))
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('拖拽中挂上 dragging 类', async () => {
    const wrapper = mountSplitter()
    stubRect(wrapper)
    await wrapper.find('.kb-splitter__bar').trigger('mousedown', { clientX: 500 })
    expect(wrapper.find('.kb-splitter').classes()).toContain('kb-splitter--dragging')
  })

  it('卸载时移除 document 监听', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const wrapper = mountSplitter()
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
  })
})
