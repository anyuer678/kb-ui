import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSwitch from '../Switch.vue'

describe('KbSwitch', () => {
  it('渲染 switch 按钮', () => {
    const wrapper = mount(KbSwitch)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('switch')
  })

  it('点击切换并触发 update:modelValue', async () => {
    const wrapper = mount(KbSwitch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('disabled 不切换', async () => {
    const wrapper = mount(KbSwitch, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('选中时应用 checked class', () => {
    const wrapper = mount(KbSwitch, { props: { modelValue: true } })
    expect(wrapper.classes()).toContain('kb-switch--checked')
  })
})
