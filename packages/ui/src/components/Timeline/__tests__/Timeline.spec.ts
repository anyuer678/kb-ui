import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTimeline from '../Timeline.vue'

const items = [
  { content: '创建项目', time: '2026-08-01' },
  { content: '发布 v1.0', time: '2026-08-08' },
  { content: '发布 v2.0', time: '2026-08-15' },
]

describe('KbTimeline', () => {
  it('渲染所有节点', () => {
    const wrapper = mount(KbTimeline, { props: { items } })
    expect(wrapper.findAll('.kb-timeline__item')).toHaveLength(3)
  })

  it('渲染内容与时间', () => {
    const wrapper = mount(KbTimeline, { props: { items } })
    expect(wrapper.find('.kb-timeline__content').text()).toContain('创建项目')
    expect(wrapper.find('.kb-timeline__time').text()).toContain('2026-08-01')
  })

  it('type 应用节点颜色', () => {
    const wrapper = mount(KbTimeline, {
      props: { items: [{ content: 'x', time: 'y', type: 'success' }] },
    })
    expect(wrapper.find('.kb-timeline__dot').classes()).toContain('kb-timeline__dot--success')
  })
})
