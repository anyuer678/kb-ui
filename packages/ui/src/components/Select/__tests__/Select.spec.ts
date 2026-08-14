import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
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

  it('点击外部关闭面板', async () => {
    const wrapper = mount(KbSelect, { props: { options } })
    await wrapper.find('.kb-select__trigger').trigger('click')
    expect(wrapper.find('.kb-select__option').exists()).toBe(true)
    document.dispatchEvent(new MouseEvent('click'))
    await nextTick()
    expect(wrapper.find('.kb-select__option').exists()).toBe(false)
    wrapper.unmount()
  })

  it('disabled 选项点击不触发选择', async () => {
    const withDisabled = [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana', disabled: true },
    ]
    const wrapper = mount(KbSelect, { props: { options: withDisabled, modelValue: '' } })
    await wrapper.find('.kb-select__trigger').trigger('click')
    await wrapper.findAll('.kb-select__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
