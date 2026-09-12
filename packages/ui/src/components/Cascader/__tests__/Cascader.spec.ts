import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCascader from '../Cascader.vue'
import type { CascaderOption } from '../Cascader.vue'

const options = [
  { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }, { label: '宁波', value: 'nb' }] },
  { label: '广东', value: 'gd', children: [{ label: '广州', value: 'gz' }] },
]

describe('KbCascader', () => {
  it('渲染第一级', () => {
    const wrapper = mount(KbCascader, { props: { options } })
    expect(wrapper.findAll('.kb-cascader__trigger').length).toBeGreaterThan(0)
  })

  it('点击展开子级', async () => {
    const wrapper = mount(KbCascader, { props: { options } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    expect(wrapper.findAll('.kb-cascader__option').length).toBeGreaterThan(0)
  })

  it('自定义分隔符展示已选路径', () => {
    const wrapper = mount(KbCascader, {
      props: { options, modelValue: ['zj', 'hz'], separator: ' · ' },
    })
    expect(wrapper.find('.kb-cascader__trigger').text()).toContain('浙江 · 杭州')
  })

  it('选择一个末级节点派发完整路径并收起面板', async () => {
    const wrapper = mount(KbCascader, { props: { options, modelValue: ['zj'] } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    // 第一列：浙江、广东；第二列：杭州、宁波
    await wrapper.findAll('.kb-cascader__option')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['zj', 'hz'])
    expect(wrapper.find('.kb-cascader__panel').exists()).toBe(false)
  })

  it('clearable 点击清空派发空数组', async () => {
    const wrapper = mount(KbCascader, {
      props: { options, modelValue: ['zj', 'hz'], clearable: true },
    })
    expect(wrapper.find('.kb-cascader__clear').exists()).toBe(true)
    await wrapper.find('.kb-cascader__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([])
  })

  it('disabled 时不可展开', async () => {
    const wrapper = mount(KbCascader, { props: { options, disabled: true } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    expect(wrapper.find('.kb-cascader__panel').exists()).toBe(false)
  })

  it('异步模式展开时加载根级选项', async () => {
    const lazyLoad = vi.fn((node: CascaderOption | null, resolve: (c: CascaderOption[]) => void) => {
      if (node === null) {
        resolve([
          { label: '浙江', value: 'zj' },
          { label: '广东', value: 'gd' },
        ])
      }
    })
    const wrapper = mount(KbCascader, { props: { lazy: true, lazyLoad } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    expect(lazyLoad).toHaveBeenCalledWith(null, expect.any(Function))
    expect(wrapper.findAll('.kb-cascader__option')).toHaveLength(2)
  })

  it('异步模式点击节点加载下一级', async () => {
    const lazyLoad = vi.fn((node: CascaderOption | null, resolve: (c: CascaderOption[]) => void) => {
      if (node === null) {
        resolve([
          { label: '浙江', value: 'zj' },
          { label: '广东', value: 'gd' },
        ])
      } else if (node.value === 'zj') {
        resolve([
          { label: '杭州', value: 'hz' },
          { label: '宁波', value: 'nb' },
        ])
      } else {
        resolve([])
      }
    })
    const wrapper = mount(KbCascader, { props: { lazy: true, lazyLoad } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    await wrapper.findAll('.kb-cascader__option')[0].trigger('click')
    // 浙江、广东 + 杭州、宁波
    expect(wrapper.findAll('.kb-cascader__option')).toHaveLength(4)
    expect(wrapper.text()).toContain('杭州')
  })

  it('异步模式 leaf 节点点击后直接收起', async () => {
    const lazyLoad = vi.fn((node: CascaderOption | null, resolve: (c: CascaderOption[]) => void) => {
      if (node === null) resolve([{ label: '浙江', value: 'zj', leaf: true }])
    })
    const wrapper = mount(KbCascader, { props: { lazy: true, lazyLoad } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    await wrapper.find('.kb-cascader__option').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['zj'])
    expect(wrapper.find('.kb-cascader__panel').exists()).toBe(false)
  })

  it('异步模式子级返回空数组时视为叶子并收起', async () => {
    const lazyLoad = vi.fn((node: CascaderOption | null, resolve: (c: CascaderOption[]) => void) => {
      if (node === null) resolve([{ label: '浙江', value: 'zj' }])
      else resolve([])
    })
    const wrapper = mount(KbCascader, { props: { lazy: true, lazyLoad } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    await wrapper.find('.kb-cascader__option').trigger('click')
    expect(lazyLoad).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.kb-cascader__panel').exists()).toBe(false)
  })
})
