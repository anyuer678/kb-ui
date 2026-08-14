import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbDatePicker from '../DatePicker.vue'

describe('KbDatePicker', () => {
  it('渲染输入框', () => {
    const wrapper = mount(KbDatePicker)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('显示已选日期', () => {
    const wrapper = mount(KbDatePicker, { props: { modelValue: '2026-08-15' } })
    expect(wrapper.find('input').element.value).toContain('2026-08-15')
  })

  it('点击弹出面板', async () => {
    const wrapper = mount(KbDatePicker)
    await wrapper.find('input').trigger('click')
    expect(wrapper.find('.kb-datepicker__panel').exists()).toBe(true)
  })

  it('选择日期触发 update', async () => {
    const wrapper = mount(KbDatePicker)
    await wrapper.find('input').trigger('click')
    await wrapper.findAll('.kb-calendar__day')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
