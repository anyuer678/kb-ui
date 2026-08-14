import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbWatermark from '../Watermark.vue'

describe('KbWatermark', () => {
  it('渲染内容', () => {
    const wrapper = mount(KbWatermark, {
      props: { text: '机密' },
      slots: { default: '<div class="content">内容</div>' },
    })
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('渲染水印层', () => {
    const wrapper = mount(KbWatermark, {
      props: { text: '机密' },
      slots: { default: '<div>内容</div>' },
    })
    expect(wrapper.find('.kb-watermark__layer').exists()).toBe(true)
  })
})
