import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbInputNumber from '../InputNumber.vue'

describe('KbInputNumber', () => {
  it('渲染数值', () => {
    const wrapper = mount(KbInputNumber, { props: { modelValue: 5 } })
    expect(wrapper.find('input').element.value).toBe('5')
  })

  it('点击加号增加', async () => {
    const wrapper = mount(KbInputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.kb-input-number__step--up').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([6])
  })

  it('受 max 限制', async () => {
    const wrapper = mount(KbInputNumber, { props: { modelValue: 10, max: 10 } })
    await wrapper.find('.kb-input-number__step--up').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
