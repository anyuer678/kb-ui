import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbEmpty from '../Empty.vue'

describe('KbEmpty', () => {
  it('渲染默认文案', () => {
    const wrapper = mount(KbEmpty)
    expect(wrapper.find('.kb-empty__description').text()).toContain('暂无数据')
  })

  it('description 自定义文案', () => {
    const wrapper = mount(KbEmpty, { props: { description: '没有匹配的结果' } })
    expect(wrapper.find('.kb-empty__description').text()).toContain('没有匹配的结果')
  })

  it('渲染操作插槽', () => {
    const wrapper = mount(KbEmpty, {
      props: { description: '暂无' },
      slots: { action: '<KbButton type="primary" size="small">去创建</KbButton>' },
    })
    expect(wrapper.find('.kb-empty__action').exists()).toBe(true)
  })

  it('渲染图片插槽', () => {
    const wrapper = mount(KbEmpty, { slots: { image: '<img src="x.png" />' } })
    expect(wrapper.find('.kb-empty__image img').exists()).toBe(true)
  })
})
