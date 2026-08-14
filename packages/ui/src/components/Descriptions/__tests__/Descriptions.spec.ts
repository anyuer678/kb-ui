import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbDescriptions from '../Descriptions.vue'

const items = [
  { label: '姓名', value: '张三' },
  { label: '年龄', value: '18' },
  { label: '城市', value: '北京' },
]

describe('KbDescriptions', () => {
  it('渲染 label 与 value', () => {
    const wrapper = mount(KbDescriptions, { props: { items } })
    expect(wrapper.findAll('.kb-descriptions__item')).toHaveLength(3)
    expect(wrapper.find('.kb-descriptions__label').text()).toContain('姓名')
    expect(wrapper.find('.kb-descriptions__value').text()).toContain('张三')
  })

  it('渲染标题', () => {
    const wrapper = mount(KbDescriptions, { props: { items, title: '基本信息' } })
    expect(wrapper.find('.kb-descriptions__title').text()).toContain('基本信息')
  })

  it('border 应用边框 class', () => {
    const wrapper = mount(KbDescriptions, { props: { items, border: true } })
    expect(wrapper.find('.kb-descriptions').classes()).toContain('kb-descriptions--border')
  })
})
