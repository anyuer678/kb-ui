import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbRate from '../Rate.vue'

describe('KbRate', () => {
  it('渲染默认 5 星', () => {
    const wrapper = mount(KbRate, { props: { modelValue: 3 } })
    expect(wrapper.findAll('.kb-rate__star')).toHaveLength(5)
  })

  it('modelValue 决定高亮数量', () => {
    const wrapper = mount(KbRate, { props: { modelValue: 3 } })
    expect(wrapper.findAll('.kb-rate__star--active')).toHaveLength(3)
  })

  it('点击触发 update:modelValue', async () => {
    const wrapper = mount(KbRate, { props: { modelValue: 1 } })
    await wrapper.findAll('.kb-rate__star')[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
  })

  it('disabled 不可点击', async () => {
    const wrapper = mount(KbRate, { props: { modelValue: 3, disabled: true } })
    await wrapper.findAll('.kb-rate__star')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
