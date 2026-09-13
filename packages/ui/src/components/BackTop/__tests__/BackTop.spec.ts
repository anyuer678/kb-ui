import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbBackTop from '../BackTop.vue'

/** 改写 window.scrollY 并派发 scroll 事件，模拟滚动 */
function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('KbBackTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('未滚动到阈值时不渲染按钮', () => {
    const wrapper = mount(KbBackTop)
    expect(wrapper.find('.kb-backtop').exists()).toBe(false)
  })

  it('滚动超过默认阈值后显示按钮', async () => {
    const wrapper = mount(KbBackTop)
    scrollTo(300)
    await nextTick()
    expect(wrapper.find('.kb-backtop').exists()).toBe(true)
  })

  it('visibilityHeight 可自定义', async () => {
    const wrapper = mount(KbBackTop, { props: { visibilityHeight: 100 } })
    scrollTo(80)
    await nextTick()
    expect(wrapper.find('.kb-backtop').exists()).toBe(false)

    scrollTo(120)
    await nextTick()
    expect(wrapper.find('.kb-backtop').exists()).toBe(true)
  })

  it('点击后回到顶部并派发 click 事件', async () => {
    const wrapper = mount(KbBackTop, { props: { duration: 0 } })
    scrollTo(500)
    await nextTick()

    await wrapper.find('.kb-backtop').trigger('click')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('按钮带无障碍标注', async () => {
    const wrapper = mount(KbBackTop)
    scrollTo(300)
    await nextTick()
    expect(wrapper.find('.kb-backtop').attributes('aria-label')).toBe('回到顶部')
  })

  it('支持自定义插槽内容', async () => {
    const wrapper = mount(KbBackTop, { slots: { default: '<span class="custom">top</span>' } })
    scrollTo(300)
    await nextTick()
    expect(wrapper.find('.custom').exists()).toBe(true)
  })

  it('监听自定义元素 target', async () => {
    const holder = document.createElement('div')
    document.body.appendChild(holder)
    const wrapper = mount(KbBackTop, { props: { target: holder, duration: 0 } })

    holder.scrollTop = 400
    holder.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('.kb-backtop').exists()).toBe(true)

    await wrapper.find('.kb-backtop').trigger('click')
    expect(holder.scrollTop).toBe(0)
    document.body.removeChild(holder)
  })

  it('卸载后移除滚动监听', async () => {
    const holder = document.createElement('div')
    document.body.appendChild(holder)
    const removeSpy = vi.spyOn(holder, 'removeEventListener')
    const wrapper = mount(KbBackTop, { props: { target: holder } })
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    document.body.removeChild(holder)
  })
})
