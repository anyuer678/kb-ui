import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTabs from '../Tabs.vue'

const tabs = [
  { label: '标签一', name: 'a' },
  { label: '标签二', name: 'b' },
  { label: '标签三', name: 'c', disabled: true },
]

describe('KbTabs', () => {
  it('渲染所有标签', () => {
    const wrapper = mount(KbTabs, { props: { tabs, modelValue: 'a' } })
    expect(wrapper.findAll('.kb-tabs__tab')).toHaveLength(3)
  })

  it('当前标签应用 active class', () => {
    const wrapper = mount(KbTabs, { props: { tabs, modelValue: 'b' } })
    expect(wrapper.findAll('.kb-tabs__tab')[1].classes()).toContain('kb-tabs__tab--active')
  })

  it('点击标签触发 update:modelValue', async () => {
    const wrapper = mount(KbTabs, { props: { tabs, modelValue: 'a' } })
    await wrapper.findAll('.kb-tabs__tab')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['b'])
  })

  it('disabled 标签不可切换', async () => {
    const wrapper = mount(KbTabs, { props: { tabs, modelValue: 'a' } })
    await wrapper.findAll('.kb-tabs__tab')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
