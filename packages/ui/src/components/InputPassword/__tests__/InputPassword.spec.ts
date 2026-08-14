import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbInputPassword from '../InputPassword.vue'

describe('KbInputPassword', () => {
  it('默认密码模式', () => {
    const wrapper = mount(KbInputPassword, { props: { modelValue: '123' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('点击切换可见', async () => {
    const wrapper = mount(KbInputPassword, { props: { modelValue: '123' } })
    await wrapper.find('.kb-input-password__toggle').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('输入触发 update', async () => {
    const wrapper = mount(KbInputPassword, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['abc'])
  })
})
