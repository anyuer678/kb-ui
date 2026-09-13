import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbAffix from '../Affix.vue'

/** jsdom 不做布局计算，getBoundingClientRect 全为 0，这里按需注入 */
function stubRect(el: Element, rect: Partial<DOMRect>) {
  const base = { top: 0, left: 0, right: 0, bottom: 0, width: 100, height: 40, x: 0, y: 0 }
  el.getBoundingClientRect = () =>
    ({ ...base, ...rect, toJSON: () => ({}) }) as unknown as DOMRect
}

describe('KbAffix', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('未滚动到固定线时不固定', () => {
    const wrapper = mount(KbAffix, { props: { offsetTop: 0 } })
    expect(wrapper.find('.kb-affix__inner--fixed').exists()).toBe(false)
  })

  it('滚动超过 offsetTop 后固定', async () => {
    const wrapper = mount(KbAffix, { props: { offsetTop: 10 } })
    stubRect(wrapper.element, { top: -20 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.find('.kb-affix__inner--fixed').exists()).toBe(true)
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('固定时写入 top / left / width', async () => {
    const wrapper = mount(KbAffix, { props: { offsetTop: 16 } })
    stubRect(wrapper.element, { top: -30, left: 24, width: 320 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const inner = wrapper.find('.kb-affix__inner')
    expect(inner.attributes('style')).toContain('top: 16px')
    expect(inner.attributes('style')).toContain('left: 24px')
    expect(inner.attributes('style')).toContain('width: 320px')
  })

  it('placeholder=false 时不写占位尺寸', async () => {
    const wrapper = mount(KbAffix, { props: { offsetTop: 0, placeholder: false } })
    stubRect(wrapper.element, { top: -30, height: 40 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.element.style.height).toBe('')
  })

  it('placeholder=true 时用占位撑住原高度', async () => {
    const wrapper = mount(KbAffix, { props: { offsetTop: 0 } })
    stubRect(wrapper.element, { top: -30, width: 200, height: 48 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.element.style.height).toBe('48px')
    expect(wrapper.element.style.width).toBe('200px')
  })

  it('offsetBottom 模式按底部距离固定', async () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true })
    const wrapper = mount(KbAffix, { props: { offsetBottom: 20 } })
    stubRect(wrapper.element, { bottom: 900 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.find('.kb-affix__inner--fixed').exists()).toBe(true)
    expect(wrapper.find('.kb-affix__inner').attributes('style')).toContain('bottom: 20px')
  })

  it('超出边界容器后解除固定', async () => {
    const boundary = document.createElement('div')
    boundary.id = 'affix-boundary'
    document.body.appendChild(boundary)
    stubRect(boundary, { bottom: 0 })

    const wrapper = mount(KbAffix, { props: { offsetTop: 0, target: '#affix-boundary' } })
    stubRect(wrapper.element, { top: -50, height: 40 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.find('.kb-affix__inner--fixed').exists()).toBe(false)
    document.body.removeChild(boundary)
  })

  it('target 指向滚动容器时，监听容器滚动并以容器顶部为固定线', async () => {
    const container = document.createElement('div')
    container.id = 'affix-scroll'
    document.body.appendChild(container)
    stubRect(container, { top: 100, bottom: 300, height: 200 })

    const wrapper = mount(KbAffix, { props: { offsetTop: 0, target: '#affix-scroll' } })

    // 元素还在容器顶部线以下：不固定
    stubRect(wrapper.element, { top: 120, height: 40 })
    container.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('.kb-affix__inner--fixed').exists()).toBe(false)

    // 容器继续滚动，元素越过容器顶部：固定到容器顶部（100px），而不是视口顶部
    stubRect(wrapper.element, { top: 90, height: 40 })
    container.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(wrapper.find('.kb-affix__inner--fixed').exists()).toBe(true)
    expect(wrapper.find('.kb-affix__inner').attributes('style')).toContain('top: 100px')

    wrapper.unmount()
    document.body.removeChild(container)
  })

  it('卸载后移除滚动与 resize 监听', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(KbAffix)
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
