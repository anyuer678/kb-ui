import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTransfer from '../Transfer.vue'

const data = [
  { key: 'a', label: '选项 A' },
  { key: 'b', label: '选项 B' },
  { key: 'c', label: '选项 C' },
]

describe('KbTransfer', () => {
  it('渲染左右列表', () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: ['b'] } })
    expect(wrapper.findAll('.kb-transfer__item')).toHaveLength(3)
  })

  it('点击移到右侧', async () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: [] } })
    await wrapper.findAll('.kb-transfer__item')[0].trigger('click')
    await wrapper.find('.kb-transfer__move--right').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // 重新挂载验证选中项进入右侧
    const next = mount(KbTransfer, { props: { data, modelValue: ['a'] } })
    expect(next.find('.kb-transfer__right').findAll('.kb-transfer__item')).toHaveLength(1)
    expect(next.find('.kb-transfer__right').text()).toContain('选项 A')
  })

  it('左侧不显示已选', () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: ['a', 'c'] } })
    const leftItems = wrapper.find('.kb-transfer__left').findAll('.kb-transfer__item')
    expect(leftItems).toHaveLength(1)
  })
})
