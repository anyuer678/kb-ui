import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbRadio from '../Radio.vue'

describe('KbRadio', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(KbRadio, {
      props: { modelValue: 'a', value: 'a' },
      slots: { default: '选项1' },
    })
    expect(wrapper.text()).toContain('选项1')
  })

  it('modelValue === value 时应用 checked class', () => {
    const wrapper = mount(KbRadio, { props: { modelValue: 'a', value: 'a' } })
    expect(wrapper.classes()).toContain('kb-radio--checked')
    const other = mount(KbRadio, { props: { modelValue: 'b', value: 'a' } })
    expect(other.classes()).not.toContain('kb-radio--checked')
  })

  it('点击触发 update:modelValue 携带 value', async () => {
    const wrapper = mount(KbRadio, { props: { modelValue: 'b', value: 'a' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['a'])
  })

  it('disabled 不触发 update', async () => {
    const wrapper = mount(KbRadio, {
      props: { modelValue: 'b', value: 'a', disabled: true },
    })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
