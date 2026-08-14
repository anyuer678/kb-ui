import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbProgress from '../Progress.vue'

describe('KbProgress', () => {
  it('按百分比渲染内层宽度', () => {
    const wrapper = mount(KbProgress, { props: { percentage: 40 } })
    expect(wrapper.find('.kb-progress__bar').attributes('style')).toContain('width: 40%')
  })

  it('渲染百分比文本', () => {
    const wrapper = mount(KbProgress, { props: { percentage: 66 } })
    expect(wrapper.text()).toContain('66%')
  })

  it('showText=false 隐藏文本', () => {
    const wrapper = mount(KbProgress, { props: { percentage: 50, showText: false } })
    expect(wrapper.find('.kb-progress__text').exists()).toBe(false)
  })

  it('status 应用对应 class', () => {
    const wrapper = mount(KbProgress, { props: { percentage: 100, status: 'success' } })
    expect(wrapper.find('.kb-progress__bar').classes()).toContain('kb-progress__bar--success')
  })

  it('percentage 超界时收敛到 0-100', () => {
    const wrapper = mount(KbProgress, { props: { percentage: 120 } })
    expect(wrapper.find('.kb-progress__bar').attributes('style')).toContain('width: 100%')
  })
})
