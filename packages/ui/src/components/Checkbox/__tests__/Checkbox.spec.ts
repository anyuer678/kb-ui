import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCheckbox from '../Checkbox.vue'

describe('KbCheckbox', () => {
  it('渲染 label', () => {
    const wrapper = mount(KbCheckbox, { props: { label: '选项A' } })
    expect(wrapper.text()).toContain('选项A')
  })

  it('点击切换并触发 update:modelValue', async () => {
    const wrapper = mount(KbCheckbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('disabled 不触发 update', async () => {
    const wrapper = mount(KbCheckbox, { props: { disabled: true } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('选中时应用 checked class', () => {
    const wrapper = mount(KbCheckbox, { props: { modelValue: true } })
    expect(wrapper.classes()).toContain('kb-checkbox--checked')
  })
})
