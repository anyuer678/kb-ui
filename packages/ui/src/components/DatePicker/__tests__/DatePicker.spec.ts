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

  it('multiple 模式显示已选数量', () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-10', '2026-08-20'], mode: 'multiple' },
    })
    expect(wrapper.find('input').element.value).toBe('已选 2 个日期')
  })

  it('multiple 模式累加选择', async () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-20'], mode: 'multiple' },
    })
    await wrapper.find('input').trigger('click')

    const day5 = wrapper.findAll('.kb-calendar__day').find((item) => item.text() === '5')
    if (!day5) throw new Error('未找到 5 号')
    await day5.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['2026-08-05', '2026-08-20'])
  })

  it('multiple 模式再次点击已选日期即取消', async () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-05', '2026-08-20'], mode: 'multiple' },
    })
    await wrapper.find('input').trigger('click')

    const day20 = wrapper.findAll('.kb-calendar__day').find((item) => item.text() === '20')
    if (!day20) throw new Error('未找到 20 号')
    await day20.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['2026-08-05'])
  })

  it('multiple 模式选择后不关闭面板', async () => {
    const wrapper = mount(KbDatePicker, { props: { modelValue: [], mode: 'multiple' } })
    await wrapper.find('input').trigger('click')
    await wrapper.findAll('.kb-calendar__day')[10].trigger('click')
    expect(wrapper.find('.kb-datepicker__panel').exists()).toBe(true)
  })

  it('range 模式显示起止文本', () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-10', '2026-08-20'], mode: 'range' },
    })
    expect(wrapper.find('input').element.value).toBe('2026-08-10 至 2026-08-20')
  })

  it('range 模式两次点击收口为区间', async () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-10'], mode: 'range' },
    })
    await wrapper.find('input').trigger('click')

    const day20 = wrapper.findAll('.kb-calendar__day').find((item) => item.text() === '20')
    if (!day20) throw new Error('未找到 20 号')
    await day20.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['2026-08-10', '2026-08-20'])
    expect(wrapper.find('.kb-datepicker__panel').exists()).toBe(false)
  })

  it('range 模式倒序点击自动交换起止', async () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-20'], mode: 'range' },
    })
    await wrapper.find('input').trigger('click')

    const day10 = wrapper.findAll('.kb-calendar__day').find((item) => item.text() === '10')
    if (!day10) throw new Error('未找到 10 号')
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['2026-08-10', '2026-08-20'])
  })

  it('range 模式高亮区间内日期', async () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: ['2026-08-10', '2026-08-20'], mode: 'range' },
    })
    await wrapper.find('input').trigger('click')
    // 8-11 ~ 8-19 共 9 天落在区间内
    expect(wrapper.findAll('.kb-calendar__day--in-range')).toHaveLength(9)
  })

  it('clearable 清空已选值', async () => {
    const wrapper = mount(KbDatePicker, {
      props: { modelValue: '2026-08-15', clearable: true },
    })
    expect(wrapper.find('.kb-datepicker__clear').exists()).toBe(true)
    await wrapper.find('.kb-datepicker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('')
  })
})
