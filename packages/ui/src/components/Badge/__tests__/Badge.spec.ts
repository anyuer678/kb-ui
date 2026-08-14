import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbBadge from '../Badge.vue'

describe('KbBadge', () => {
  it('渲染角标内容', () => {
    const wrapper = mount(KbBadge, { props: { content: 5 } })
    expect(wrapper.find('.kb-badge__content').text()).toBe('5')
  })

  it('超过 max 时封顶显示 max+', () => {
    const wrapper = mount(KbBadge, { props: { content: 100, max: 99 } })
    expect(wrapper.find('.kb-badge__content').text()).toBe('99+')
  })

  it('dot 模式不显示文字', () => {
    const wrapper = mount(KbBadge, { props: { dot: true, content: 5 } })
    expect(wrapper.find('.kb-badge__content').text()).toBe('')
    expect(wrapper.find('.kb-badge__content').classes()).toContain('kb-badge__content--dot')
  })

  it('包裹子元素时作为角标定位', () => {
    const wrapper = mount(KbBadge, {
      props: { content: 3 },
      slots: { default: '<button>消息</button>' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.classes()).not.toContain('kb-badge--independent')
  })

  it('自定义颜色生效', () => {
    const wrapper = mount(KbBadge, { props: { content: 1, color: '#ff6600' } })
    expect(wrapper.find('.kb-badge__content').attributes('style')).toContain('background')
  })
})
