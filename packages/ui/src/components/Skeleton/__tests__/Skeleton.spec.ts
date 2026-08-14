import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSkeleton from '../Skeleton.vue'

describe('KbSkeleton', () => {
  it('渲染默认骨架行', () => {
    const wrapper = mount(KbSkeleton)
    expect(wrapper.findAll('.kb-skeleton__item')).toHaveLength(3)
  })

  it('rows 控制行数', () => {
    const wrapper = mount(KbSkeleton, { props: { rows: 5 } })
    expect(wrapper.findAll('.kb-skeleton__item')).toHaveLength(5)
  })

  it('animated 应用动画 class', () => {
    const wrapper = mount(KbSkeleton, { props: { animated: true } })
    expect(wrapper.classes()).toContain('kb-skeleton--animated')
  })

  it('有插槽时不显示骨架', () => {
    const wrapper = mount(KbSkeleton, { slots: { default: '<p>内容</p>' } })
    expect(wrapper.find('.kb-skeleton__item').exists()).toBe(false)
    expect(wrapper.text()).toContain('内容')
  })
})
