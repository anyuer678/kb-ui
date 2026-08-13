import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSpace from '../Space.vue'

describe('KbSpace', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(KbSpace, { slots: { default: '<span>a</span><span>b</span>' } })
    expect(wrapper.findAll('span')).toHaveLength(2)
  })

  it('vertical 应用竖向 class', () => {
    const wrapper = mount(KbSpace, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('kb-space--vertical')
  })

  it('wrap 应用换行 class', () => {
    const wrapper = mount(KbSpace, { props: { wrap: true } })
    expect(wrapper.classes()).toContain('kb-space--wrap')
  })

  it('自定义数字 size 生效为 gap 内联样式', () => {
    const wrapper = mount(KbSpace, { props: { size: 24 } })
    expect(wrapper.attributes('style')).toContain('gap: 24px')
  })
})
