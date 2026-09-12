import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTransfer from '../Transfer.vue'

const data = [
  { key: 'a', label: '选项 A' },
  { key: 'b', label: '选项 B' },
  { key: 'c', label: '选项 C' },
]

const manyItems = Array.from({ length: 25 }, (_, i) => ({ key: `k${i}`, label: `选项 ${i}` }))

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

  it('自定义标题', () => {
    const wrapper = mount(KbTransfer, {
      props: { data, modelValue: [], titles: ['候选列表', '已选列表'] },
    })
    expect(wrapper.find('.kb-transfer__header').text()).toContain('候选列表')
  })

  it('搜索过滤左侧列表', async () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: [], filterable: true } })
    await wrapper.findAll('.kb-transfer__input')[0].setValue('选项 A')
    expect(wrapper.find('.kb-transfer__left').findAll('.kb-transfer__item')).toHaveLength(1)
    expect(wrapper.find('.kb-transfer__left').text()).toContain('选项 A')
  })

  it('搜索无结果时显示空状态', async () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: [], filterable: true } })
    await wrapper.findAll('.kb-transfer__input')[0].setValue('不存在的关键字')
    expect(wrapper.find('.kb-transfer__left').findAll('.kb-transfer__item')).toHaveLength(0)
    expect(wrapper.find('.kb-transfer__left').find('.kb-transfer__empty').exists()).toBe(true)
  })

  it('分页限制每页条数并可翻页', async () => {
    const wrapper = mount(KbTransfer, {
      props: { data: manyItems, modelValue: [], pageSize: 10 },
    })
    expect(wrapper.find('.kb-transfer__left').findAll('.kb-transfer__item')).toHaveLength(10)
    expect(wrapper.find('.kb-transfer__page-info').text()).toBe('1 / 3')
    await wrapper.find('.kb-transfer__page--next').trigger('click')
    expect(wrapper.find('.kb-transfer__page-info').text()).toBe('2 / 3')
    expect(wrapper.find('.kb-transfer__left').findAll('.kb-transfer__item')).toHaveLength(10)
  })

  it('表头全选当前页', async () => {
    const wrapper = mount(KbTransfer, {
      props: { data: manyItems, modelValue: [], pageSize: 10 },
    })
    await wrapper.find('.kb-transfer__header .kb-checkbox__input').setValue(true)
    await wrapper.find('.kb-transfer__move--right').trigger('click')
    const moved = wrapper.emitted('update:modelValue')?.[0]?.[0] as string[]
    expect(moved).toHaveLength(10)
  })

  it('change 事件携带方向', async () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: [] } })
    await wrapper.findAll('.kb-transfer__item')[0].trigger('click')
    await wrapper.find('.kb-transfer__move--right').trigger('click')
    expect(wrapper.emitted('change')?.[0]?.[1]).toBe('right')
  })

  it('disabled 时不可选中与移动', async () => {
    const wrapper = mount(KbTransfer, { props: { data, modelValue: [], disabled: true } })
    await wrapper.findAll('.kb-transfer__item')[0].trigger('click')
    await wrapper.find('.kb-transfer__move--right').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})
