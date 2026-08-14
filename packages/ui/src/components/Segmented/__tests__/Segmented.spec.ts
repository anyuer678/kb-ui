import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSegmented from '../Segmented.vue'

const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

describe('KbSegmented', () => {
  it('渲染所有选项', () => {
    const wrapper = mount(KbSegmented, { props: { options, modelValue: 'day' } })
    expect(wrapper.findAll('.kb-segmented__item')).toHaveLength(3)
  })

  it('选中项应用 active class', () => {
    const wrapper = mount(KbSegmented, { props: { options, modelValue: 'week' } })
    expect(wrapper.findAll('.kb-segmented__item')[1].classes()).toContain('kb-segmented__item--active')
  })

  it('点击触发 update', async () => {
    const wrapper = mount(KbSegmented, { props: { options, modelValue: 'day' } })
    await wrapper.findAll('.kb-segmented__item')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['month'])
  })
})
