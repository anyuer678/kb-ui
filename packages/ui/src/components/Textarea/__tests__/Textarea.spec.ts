import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTextarea from '../Textarea.vue'

describe('KbTextarea', () => {
  it('渲染值与占位符', () => {
    const wrapper = mount(KbTextarea, { props: { modelValue: '你好', placeholder: '请输入' } })
    expect(wrapper.find('textarea').element.value).toBe('你好')
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('请输入')
  })

  it('输入触发 update', async () => {
    const wrapper = mount(KbTextarea, { props: { modelValue: '' } })
    await wrapper.find('textarea').setValue('abc')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['abc'])
  })

  it('rows 生效', () => {
    const wrapper = mount(KbTextarea, { props: { modelValue: '', rows: 5 } })
    expect(wrapper.find('textarea').attributes('rows')).toBe('5')
  })

  it('maxlength 显示计数', () => {
    const wrapper = mount(KbTextarea, { props: { modelValue: 'abc', maxlength: 10 } })
    expect(wrapper.find('.kb-textarea__count').text()).toContain('3/10')
  })
})
