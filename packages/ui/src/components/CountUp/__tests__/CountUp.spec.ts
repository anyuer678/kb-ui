import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCountUp from '../CountUp.vue'

describe('KbCountUp', () => {
  it('渲染组件', () => {
    const wrapper = mount(KbCountUp, { props: { end: 100 } })
    expect(wrapper.find('.kb-countup').exists()).toBe(true)
  })

  it('渲染前缀后缀', () => {
    const wrapper = mount(KbCountUp, { props: { end: 42, prefix: '$', suffix: '万' } })
    expect(wrapper.text()).toContain('$')
    expect(wrapper.text()).toContain('万')
  })

  it('动画结束显示 end 值', async () => {
    const wrapper = mount(KbCountUp, { props: { end: 100, duration: 50 } })
    await new Promise((r) => setTimeout(r, 300))
    expect(wrapper.find('.kb-countup').text()).toContain('100')
  })
})
