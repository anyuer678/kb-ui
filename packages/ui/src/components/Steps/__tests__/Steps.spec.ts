import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSteps from '../Steps.vue'

const steps = [
  { title: '第一步', description: '开始' },
  { title: '第二步', description: '进行中' },
  { title: '第三步', description: '结束' },
]

describe('KbSteps', () => {
  it('渲染所有步骤', () => {
    const wrapper = mount(KbSteps, { props: { steps, active: 1 } })
    expect(wrapper.findAll('.kb-steps__item')).toHaveLength(3)
  })

  it('active 之前的步骤完成', () => {
    const wrapper = mount(KbSteps, { props: { steps, active: 1 } })
    expect(wrapper.findAll('.kb-steps__item')[0].classes()).toContain('kb-steps__item--done')
  })

  it('当前步骤应用 active class', () => {
    const wrapper = mount(KbSteps, { props: { steps, active: 1 } })
    expect(wrapper.findAll('.kb-steps__item')[1].classes()).toContain('kb-steps__item--active')
  })
})
