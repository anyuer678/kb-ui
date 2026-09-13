import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTimePicker from '../TimePicker.vue'

describe('KbTimePicker', () => {
  it('未选择时展示默认占位文案', () => {
    const wrapper = mount(KbTimePicker)
    expect(wrapper.find('.kb-timepicker__text').text()).toBe('请选择时间')
  })

  it('placeholder 可自定义', () => {
    const wrapper = mount(KbTimePicker, { props: { placeholder: '几点' } })
    expect(wrapper.find('.kb-timepicker__text').text()).toBe('几点')
  })

  it('默认 24 小时 + 60 分钟两列', async () => {
    const wrapper = mount(KbTimePicker)
    await wrapper.find('.kb-timepicker__control').trigger('click')
    const columns = wrapper.findAll('.kb-timepicker__column')
    expect(columns).toHaveLength(2)
    expect(columns[0].findAll('.kb-timepicker__option')).toHaveLength(24)
    expect(columns[1].findAll('.kb-timepicker__option')).toHaveLength(60)
  })

  it('format 含 ss 时启用秒列', async () => {
    const wrapper = mount(KbTimePicker, { props: { format: 'HH:mm:ss' } })
    await wrapper.find('.kb-timepicker__control').trigger('click')
    const columns = wrapper.findAll('.kb-timepicker__column')
    expect(columns).toHaveLength(3)
    expect(columns[2].findAll('.kb-timepicker__option')).toHaveLength(60)
  })

  it('minuteStep 控制分钟粒度', async () => {
    const wrapper = mount(KbTimePicker, { props: { minuteStep: 15 } })
    await wrapper.find('.kb-timepicker__control').trigger('click')
    const minutes = wrapper.findAll('.kb-timepicker__column')[1].findAll('.kb-timepicker__option')
    expect(minutes.map((n) => n.text())).toEqual(['00', '15', '30', '45'])
  })

  it('选择小时后拼出完整时间', async () => {
    const wrapper = mount(KbTimePicker)
    await wrapper.find('.kb-timepicker__control').trigger('click')
    await wrapper.findAll('.kb-timepicker__option')[9].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:00'])
  })

  it('选择分钟后保留已选小时', async () => {
    const wrapper = mount(KbTimePicker, { props: { modelValue: '14:00' } })
    await wrapper.find('.kb-timepicker__control').trigger('click')
    const minutes = wrapper.findAll('.kb-timepicker__column')[1].findAll('.kb-timepicker__option')
    await minutes[30].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['14:30'])
  })

  it('已选值高亮对应项', async () => {
    const wrapper = mount(KbTimePicker, { props: { modelValue: '07:20' } })
    await wrapper.find('.kb-timepicker__control').trigger('click')
    const active = wrapper.findAll('.kb-timepicker__option--active').map((n) => n.text())
    expect(active).toEqual(['07', '20'])
  })

  it('秒列选择后输出三段格式', async () => {
    const wrapper = mount(KbTimePicker, { props: { format: 'HH:mm:ss', modelValue: '08:00:00' } })
    await wrapper.find('.kb-timepicker__control').trigger('click')
    const seconds = wrapper.findAll('.kb-timepicker__column')[2].findAll('.kb-timepicker__option')
    await seconds[45].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['08:00:45'])
  })

  it('clearable 清空', async () => {
    const wrapper = mount(KbTimePicker, { props: { modelValue: '10:00', clearable: true } })
    await wrapper.find('.kb-timepicker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('disabled 时不展开', async () => {
    const wrapper = mount(KbTimePicker, { props: { disabled: true } })
    await wrapper.find('.kb-timepicker__control').trigger('click')
    expect(wrapper.find('.kb-timepicker__panel').exists()).toBe(false)
  })

  it('Esc 关闭面板', async () => {
    const wrapper = mount(KbTimePicker)
    await wrapper.find('.kb-timepicker__control').trigger('click')
    await wrapper.find('.kb-timepicker__control').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.kb-timepicker__panel').exists()).toBe(false)
  })
})
