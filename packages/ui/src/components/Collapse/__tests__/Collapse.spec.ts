import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCollapse from '../Collapse.vue'

const items = [
  { title: '标题一', content: '内容一' },
  { title: '标题二', content: '内容二' },
  { title: '标题三', content: '内容三', disabled: true },
]

describe('KbCollapse', () => {
  it('渲染标题', () => {
    const wrapper = mount(KbCollapse, { props: { items } })
    expect(wrapper.findAll('.kb-collapse__header')).toHaveLength(3)
    expect(wrapper.find('.kb-collapse__header').text()).toContain('标题一')
  })

  it('点击展开内容', async () => {
    const wrapper = mount(KbCollapse, { props: { items } })
    await wrapper.findAll('.kb-collapse__header')[0].trigger('click')
    expect(wrapper.find('.kb-collapse__content').text()).toContain('内容一')
  })

  it('disabled 项不可展开', async () => {
    const wrapper = mount(KbCollapse, { props: { items } })
    await wrapper.findAll('.kb-collapse__header')[2].trigger('click')
    expect(wrapper.find('.kb-collapse__content').exists()).toBe(false)
  })

  it('accordion 模式互斥', async () => {
    const wrapper = mount(KbCollapse, { props: { items, accordion: true } })
    await wrapper.findAll('.kb-collapse__header')[0].trigger('click')
    await wrapper.findAll('.kb-collapse__header')[1].trigger('click')
    expect(wrapper.findAll('.kb-collapse__content')).toHaveLength(1)
  })
})
