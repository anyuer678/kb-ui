import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbAlert from '../Alert.vue'

describe('KbAlert', () => {
  it('渲染标题与默认插槽', () => {
    const wrapper = mount(KbAlert, {
      props: { title: '提示' },
      slots: { default: '这是一条提示' },
    })
    expect(wrapper.find('.kb-alert__title').text()).toContain('提示')
    expect(wrapper.find('.kb-alert__content').text()).toContain('这是一条提示')
  })

  it('type 应用对应 class', () => {
    const wrapper = mount(KbAlert, { props: { type: 'danger' } })
    expect(wrapper.classes()).toContain('kb-alert--danger')
  })

  it('closable 点击关闭后移除', async () => {
    const wrapper = mount(KbAlert, { props: { closable: true } })
    expect(wrapper.find('.kb-alert').exists()).toBe(true)
    await wrapper.find('.kb-alert__close').trigger('click')
    expect(wrapper.find('.kb-alert').exists()).toBe(false)
  })

  it('showIcon 渲染图标', () => {
    const wrapper = mount(KbAlert, { props: { showIcon: true } })
    expect(wrapper.find('.kb-alert__icon').exists()).toBe(true)
  })
})
