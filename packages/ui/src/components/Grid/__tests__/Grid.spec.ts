import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbRow from '../Row.vue'
import KbCol from '../Col.vue'

describe('KbRow', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(KbRow, { slots: { default: '<span>x</span>' } })
    expect(wrapper.find('span').text()).toBe('x')
  })

  it('justify 应用对应 class', () => {
    const wrapper = mount(KbRow, { props: { justify: 'space-between' } })
    expect(wrapper.classes()).toContain('kb-row--space-between')
  })

  it('gutter 生效为负 margin', () => {
    const wrapper = mount(KbRow, { props: { gutter: 16 } })
    expect(wrapper.attributes('style')).toContain('margin-left: -8px')
    expect(wrapper.attributes('style')).toContain('margin-right: -8px')
  })
})

describe('KbCol', () => {
  it('span 生成对应 class', () => {
    const wrapper = mount(KbCol, { props: { span: 12 } })
    expect(wrapper.classes()).toContain('kb-col-12')
  })

  it('offset 生成对应 class', () => {
    const wrapper = mount(KbCol, { props: { offset: 4 } })
    expect(wrapper.classes()).toContain('kb-col-offset-4')
  })

  it('gutter 生效为 padding', () => {
    // Col 通过 Row 的 provide 获取 gutter
    const rowWrapper = mount({
      components: { KbRow, KbCol },
      template: '<kb-row :gutter="16"><kb-col :span="8">a</kb-col></kb-row>',
    })
    const col = rowWrapper.findComponent(KbCol)
    expect(col.attributes('style')).toContain('padding-left: 8px')
    expect(col.attributes('style')).toContain('padding-right: 8px')
  })
})
