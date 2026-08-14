import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbColorPicker from '../ColorPicker.vue'

describe('KbColorPicker', () => {
  it('渲染预设色块', () => {
    const wrapper = mount(KbColorPicker)
    expect(wrapper.findAll('.kb-colorpicker__swatch')).toHaveLength(10)
  })

  it('点击色块触发 update', async () => {
    const wrapper = mount(KbColorPicker)
    await wrapper.findAll('.kb-colorpicker__swatch')[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['#10b981'])
  })

  it('显示当前颜色', () => {
    const wrapper = mount(KbColorPicker, { props: { modelValue: '#7c3aed' } })
    expect(wrapper.find('.kb-colorpicker__value').attributes('style')).toContain('rgb(124, 58, 237)')
  })
})
