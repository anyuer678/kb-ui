import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbInput from '../Input.vue'

describe('KbInput', () => {
  it('渲染 value', () => {
    const wrapper = mount(KbInput, { props: { modelValue: 'hello' } })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello')
  })

  it('输入触发 update:modelValue', async () => {
    const wrapper = mount(KbInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['abc'])
  })

  it('disabled 禁止输入', async () => {
    const wrapper = mount(KbInput, { props: { disabled: true } })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.setValue('x')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clearable 点击清空', async () => {
    const wrapper = mount(KbInput, { props: { modelValue: 'text', clearable: true } })
    await wrapper.find('.kb-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
  })
})
