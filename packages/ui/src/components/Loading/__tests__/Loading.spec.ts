import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbLoading from '../Loading.vue'

describe('KbLoading', () => {
  it('渲染旋转指示器', () => {
    const wrapper = mount(KbLoading)
    expect(wrapper.find('.kb-loading__spinner').exists()).toBe(true)
  })

  it('渲染提示文字', () => {
    const wrapper = mount(KbLoading, { props: { text: '加载中…' } })
    expect(wrapper.find('.kb-loading__text').text()).toContain('加载中…')
  })

  it('size 生效为内联尺寸', () => {
    const wrapper = mount(KbLoading, { props: { size: 32 } })
    expect(wrapper.find('.kb-loading__spinner').attributes('style')).toContain('width: 32px')
  })
})
