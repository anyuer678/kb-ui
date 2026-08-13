import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbButton from '../Button.vue'

describe('KbButton', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(KbButton, { slots: { default: '点击' } })
    expect(wrapper.text()).toContain('点击')
  })

  it('点击触发 click 事件', async () => {
    const wrapper = mount(KbButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('disabled 时不触发 click', async () => {
    const wrapper = mount(KbButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('type=primary 应用对应 class', () => {
    const wrapper = mount(KbButton, { props: { type: 'primary' } })
    expect(wrapper.classes()).toContain('kb-button--primary')
  })

  it('round 应用圆角 class', () => {
    const wrapper = mount(KbButton, { props: { round: true } })
    expect(wrapper.classes()).toContain('kb-button--round')
  })
})
