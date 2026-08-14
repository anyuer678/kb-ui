import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCard from '../Card.vue'

describe('KbCard', () => {
  it('渲染标题', () => {
    const wrapper = mount(KbCard, { props: { title: '卡片标题' } })
    expect(wrapper.find('.kb-card__header').text()).toContain('卡片标题')
  })

  it('渲染默认插槽内容', () => {
    const wrapper = mount(KbCard, { slots: { default: '<p>内容</p>' } })
    expect(wrapper.find('.kb-card__body').text()).toContain('内容')
  })

  it('渲染 footer 插槽', () => {
    const wrapper = mount(KbCard, { slots: { footer: '<button>操作</button>' } })
    expect(wrapper.find('.kb-card__footer button').text()).toContain('操作')
  })

  it('shadow 属性生效', () => {
    const wrapper = mount(KbCard, { props: { shadow: 'hover' } })
    expect(wrapper.classes()).toContain('kb-card--shadow-hover')
  })
})
