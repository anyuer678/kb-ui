import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCalendar from '../Calendar.vue'

describe('KbCalendar', () => {
  it('渲染月份标题', () => {
    const wrapper = mount(KbCalendar, { props: { modelValue: '2026-08-15' } })
    expect(wrapper.find('.kb-calendar__title').text()).toMatch(/2026/)
  })

  it('渲染日期格', () => {
    const wrapper = mount(KbCalendar, { props: { modelValue: '2026-08-15' } })
    expect(wrapper.findAll('.kb-calendar__day').length).toBeGreaterThan(28)
  })

  it('选中日期应用 active class', () => {
    const wrapper = mount(KbCalendar, { props: { modelValue: '2026-08-15' } })
    const active = wrapper.findAll('.kb-calendar__day--active')
    expect(active.length).toBeGreaterThan(0)
  })

  it('点击日期触发 update', async () => {
    const wrapper = mount(KbCalendar, { props: { modelValue: '2026-08-15' } })
    await wrapper.findAll('.kb-calendar__day')[8].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
