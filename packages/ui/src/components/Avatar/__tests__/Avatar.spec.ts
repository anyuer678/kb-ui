import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbAvatar from '../Avatar.vue'

describe('KbAvatar', () => {
  it('有 src 时渲染图片', () => {
    const wrapper = mount(KbAvatar, { props: { src: 'https://example.com/a.png', alt: '头像' } })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/a.png')
  })

  it('无 src 时显示 fallback 首字符', () => {
    const wrapper = mount(KbAvatar, { props: { fallback: '张' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('张')
  })

  it('无 src 无 fallback 时显示默认图标', () => {
    const wrapper = mount(KbAvatar)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.kb-avatar__icon').exists()).toBe(true)
  })

  it('round 应用圆形 class', () => {
    const wrapper = mount(KbAvatar, { props: { round: true } })
    expect(wrapper.classes()).toContain('kb-avatar--round')
  })

  it('数字 size 生效为内联宽高', () => {
    const wrapper = mount(KbAvatar, { props: { size: 48 } })
    expect(wrapper.attributes('style')).toContain('width: 48px')
    expect(wrapper.attributes('style')).toContain('height: 48px')
  })
})
