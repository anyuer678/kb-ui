import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSlider from '../Slider.vue'

describe('KbSlider', () => {
  it('渲染轨道与滑块', () => {
    const wrapper = mount(KbSlider, { props: { modelValue: 30 } })
    expect(wrapper.find('.kb-slider__track').exists()).toBe(true)
    expect(wrapper.find('.kb-slider__handle').exists()).toBe(true)
  })

  it('填充宽度按值计算', () => {
    const wrapper = mount(KbSlider, { props: { modelValue: 50 } })
    expect(wrapper.find('.kb-slider__fill').attributes('style')).toContain('width: 50%')
  })

  it('disabled 应用 class', () => {
    const wrapper = mount(KbSlider, { props: { modelValue: 30, disabled: true } })
    expect(wrapper.classes()).toContain('kb-slider--disabled')
  })
})
