import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbIcon from '../Icon.vue'

describe('KbIcon', () => {
  it('按 name 渲染对应 svg path', () => {
    const wrapper = mount(KbIcon, { props: { name: 'check' } })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toBeTruthy()
  })

  it('未知 name 渲染空图标', () => {
    const wrapper = mount(KbIcon, { props: { name: 'not-exist' } })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').exists()).toBe(false)
  })

  it('size 生效', () => {
    const wrapper = mount(KbIcon, { props: { name: 'check', size: 20 } })
    expect(wrapper.find('svg').attributes('width')).toBe('20')
    expect(wrapper.find('svg').attributes('height')).toBe('20')
  })

  it('color 生效', () => {
    const wrapper = mount(KbIcon, { props: { name: 'check', color: '#f00' } })
    expect(wrapper.find('svg').attributes('style')).toContain('color: rgb(255, 0, 0)')
  })
})
