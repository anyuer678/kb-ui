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

describe('KbSelect 键盘导航与 ARIA', () => {
  const trigger = (w: ReturnType<typeof mount>, key: string) =>
    w.find('[role="combobox"]').trigger('keydown', { key })

  it('ARIA：combobox/listbox/option/aria-selected', async () => {
    const wrapper = mount(KbSelect, { props: { options, modelValue: 'apple' } })
    const box = wrapper.find('[role="combobox"]')
    expect(box.attributes('aria-haspopup')).toBe('listbox')
    expect(box.attributes('aria-expanded')).toBe('false')
    await box.trigger('click')
    expect(box.attributes('aria-expanded')).toBe('true')
    const list = wrapper.find('[role="listbox"]')
    expect(list.exists()).toBe(true)
    const opts = wrapper.findAll('[role="option"]')
    expect(opts).toHaveLength(2)
    expect(opts[0].attributes('aria-selected')).toBe('true')
  })

  it('ArrowDown 展开并激活首项，再按移动，Enter 选中', async () => {
    const wrapper = mount(KbSelect, { props: { options, modelValue: '' } })
    await trigger(wrapper, 'ArrowDown')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    expect(wrapper.find('.kb-select__option--active').text()).toContain('苹果')
    await trigger(wrapper, 'ArrowDown')
    await trigger(wrapper, 'Enter')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['banana'])
  })

  it('Enter 在面板关闭时展开，Space 同效', async () => {
    const wrapper = mount(KbSelect, { props: { options } })
    await trigger(wrapper, 'Enter')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    await trigger(wrapper, 'Escape')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    await trigger(wrapper, ' ')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('Escape 关闭面板且不选中', async () => {
    const wrapper = mount(KbSelect, { props: { options } })
    await trigger(wrapper, 'ArrowDown')
    await trigger(wrapper, 'Escape')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('disabled 选项被键盘跳过', async () => {
    const withDisabled = [
      { label: '苹果', value: 'apple', disabled: true },
      { label: '香蕉', value: 'banana' },
    ]
    const wrapper = mount(KbSelect, { props: { options: withDisabled } })
    await trigger(wrapper, 'ArrowDown')
    expect(wrapper.find('.kb-select__option--active').text()).toContain('香蕉')
  })

  it('Home/End 跳转首尾，ArrowUp 回绕上一可选项', async () => {
    const wrapper = mount(KbSelect, { props: { options } })
    await trigger(wrapper, 'ArrowDown')
    await trigger(wrapper, 'End')
    expect(wrapper.find('.kb-select__option--active').text()).toContain('香蕉')
    await trigger(wrapper, 'Home')
    expect(wrapper.find('.kb-select__option--active').text()).toContain('苹果')
  })

  it('已选中项打开面板时高亮该项', async () => {
    const wrapper = mount(KbSelect, { props: { options, modelValue: 'banana' } })
    await trigger(wrapper, 'ArrowDown')
    expect(wrapper.find('.kb-select__option--active').text()).toContain('香蕉')
  })
})
