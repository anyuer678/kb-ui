import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSelect from '../Select.vue'

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
]

describe('KbSelect', () => {
  it('未选中时显示占位符', () => {
    const wrapper = mount(KbSelect, { props: { options, placeholder: '请选择' } })
    expect(wrapper.find('.kb-select__trigger').text()).toContain('请选择')
  })

  it('点击展开选项列表', async () => {
    const wrapper = mount(KbSelect, { props: { options } })
    expect(wrapper.find('.kb-select__option').exists()).toBe(false)
    await wrapper.find('.kb-select__trigger').trigger('click')
    expect(wrapper.findAll('.kb-select__option')).toHaveLength(2)
  })

  it('选择选项触发 update:modelValue 携带选中值', async () => {
    const wrapper = mount(KbSelect, { props: { options, modelValue: '' } })
    await wrapper.find('.kb-select__trigger').trigger('click')
    await wrapper.findAll('.kb-select__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['banana'])
  })

  it('已选值时显示对应 label', () => {
    const wrapper = mount(KbSelect, { props: { options, modelValue: 'banana' } })
    expect(wrapper.find('.kb-select__trigger').text()).toContain('香蕉')
  })

  it('disabled 不展开', async () => {
    const wrapper = mount(KbSelect, { props: { options, disabled: true } })
    await wrapper.find('.kb-select__trigger').trigger('click')
    expect(wrapper.find('.kb-select__option').exists()).toBe(false)
  })
})
