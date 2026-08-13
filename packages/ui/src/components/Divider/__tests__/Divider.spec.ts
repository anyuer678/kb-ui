import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbDivider from '../Divider.vue'

describe('KbDivider', () => {
  it('渲染水平分割线', () => {
    const wrapper = mount(KbDivider)
    expect(wrapper.classes()).toContain('kb-divider')
    expect(wrapper.classes()).not.toContain('kb-divider--vertical')
  })

  it('vertical 应用竖向 class', () => {
    const wrapper = mount(KbDivider, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('kb-divider--vertical')
  })

  it('带插槽时渲染文字', () => {
    const wrapper = mount(KbDivider, { slots: { default: '分割' } })
    expect(wrapper.find('.kb-divider__text').text()).toContain('分割')
  })

  it('contentPosition=left 应用对应 class', () => {
    const wrapper = mount(KbDivider, {
      props: { contentPosition: 'left' },
      slots: { default: '左' },
    })
    expect(wrapper.classes()).toContain('kb-divider--content-left')
  })
})
