import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbStatistic from '../Statistic.vue'

describe('KbStatistic', () => {
  it('渲染数值与标题', () => {
    const wrapper = mount(KbStatistic, { props: { title: '总用户', value: 12345 } })
    expect(wrapper.find('.kb-statistic__title').text()).toContain('总用户')
    expect(wrapper.find('.kb-statistic__value').text()).toContain('12,345')
  })

  it('千分位格式化', () => {
    const wrapper = mount(KbStatistic, { props: { title: '总量', value: 1234567 } })
    expect(wrapper.find('.kb-statistic__value').text()).toContain('1,234,567')
  })

  it('小数精度', () => {
    const wrapper = mount(KbStatistic, { props: { title: '比例', value: 12.5, precision: 1 } })
    expect(wrapper.find('.kb-statistic__value').text()).toContain('12.5')
  })

  it('自定义前缀与后缀', () => {
    const wrapper = mount(KbStatistic, { props: { title: '涨幅', value: 12.5, suffix: '%' } })
    expect(wrapper.find('.kb-statistic__value').text()).toContain('%')
  })
})
