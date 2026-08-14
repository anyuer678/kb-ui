import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbSearch from '../Search.vue'

describe('KbSearch', () => {
  it('渲染输入框与按钮', () => {
    const wrapper = mount(KbSearch)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.kb-search__button').text()).toContain('搜索')
  })

  it('点击按钮触发 search 事件', async () => {
    const wrapper = mount(KbSearch, { props: { modelValue: 'vue' } })
    await wrapper.find('.kb-search__button').trigger('click')
    expect(wrapper.emitted('search')![0]).toEqual(['vue'])
  })

  it('回车触发 search', async () => {
    const wrapper = mount(KbSearch, { props: { modelValue: 'abc' } })
    await wrapper.find('input').trigger('keyup.enter')
    expect(wrapper.emitted('search')![0]).toEqual(['abc'])
  })
})
