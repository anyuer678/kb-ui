import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTag from '../Tag.vue'

describe('KbTag', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(KbTag, { slots: { default: '标签' } })
    expect(wrapper.text()).toContain('标签')
  })

  it('type=success 应用对应 class', () => {
    const wrapper = mount(KbTag, { props: { type: 'success' } })
    expect(wrapper.classes()).toContain('kb-tag--success')
  })

  it('closable 点击关闭按钮触发 close 事件', async () => {
    const wrapper = mount(KbTag, { props: { closable: true } })
    await wrapper.find('.kb-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('round 应用圆角 class', () => {
    const wrapper = mount(KbTag, { props: { round: true } })
    expect(wrapper.classes()).toContain('kb-tag--round')
  })
})
