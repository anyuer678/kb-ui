import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbTreeSelect from '../TreeSelect.vue'
import type { TreeSelectNode } from '../TreeSelect.vue'

const TREE: TreeSelectNode[] = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
  { label: '江苏', value: 'js', children: [{ label: '南京', value: 'nj' }] },
]

describe('KbTreeSelect', () => {
  it('未选择时展示占位文案', () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE } })
    expect(wrapper.find('.kb-treeselect__text').text()).toBe('请选择')
    expect(wrapper.find('.kb-treeselect__text--placeholder').exists()).toBe(true)
  })

  it('placeholder 可自定义', () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, placeholder: '选择地区' } })
    expect(wrapper.find('.kb-treeselect__text').text()).toBe('选择地区')
  })

  it('默认折叠，仅展示顶层节点', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    const labels = wrapper.findAll('.kb-treeselect__label').map((n) => n.text())
    expect(labels).toEqual(['浙江', '江苏'])
  })

  it('点击展开箭头后展示子节点', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    await wrapper.findAll('.kb-treeselect__toggle')[0].trigger('click')
    await nextTick()

    const labels = wrapper.findAll('.kb-treeselect__label').map((n) => n.text())
    expect(labels).toEqual(['浙江', '杭州', '宁波', '江苏'])
  })

  it('defaultExpandAll 初始展开全部层级', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, defaultExpandAll: true } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    const labels = wrapper.findAll('.kb-treeselect__label').map((n) => n.text())
    expect(labels).toEqual(['浙江', '杭州', '宁波', '江苏', '南京'])
  })

  it('子节点按层级缩进', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, defaultExpandAll: true } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    const nodes = wrapper.findAll('.kb-treeselect__node')
    expect(nodes[0].attributes('style')).toContain('padding-left: 12px')
    expect(nodes[1].attributes('style')).toContain('padding-left: 30px')
  })

  it('点击节点选中并回填 label', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, defaultExpandAll: true } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    await wrapper.findAll('.kb-treeselect__node')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hz'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['hz'])
    expect(wrapper.find('.kb-treeselect__panel').exists()).toBe(false)
  })

  it('已选值回显为对应 label', () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, modelValue: 'nb' } })
    expect(wrapper.find('.kb-treeselect__text').text()).toBe('宁波')
  })

  it('点击已展开节点再次点击箭头可折叠', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, defaultExpandAll: true } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    await wrapper.findAll('.kb-treeselect__toggle')[0].trigger('click')
    await nextTick()
    const labels = wrapper.findAll('.kb-treeselect__label').map((n) => n.text())
    expect(labels).toEqual(['浙江', '江苏', '南京'])
  })

  it('disabled 节点不可选中', async () => {
    const tree: TreeSelectNode[] = [{ label: '禁用项', value: 'x', disabled: true }]
    const wrapper = mount(KbTreeSelect, { props: { options: tree } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    await wrapper.find('.kb-treeselect__node').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clearable 清空选中值', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, modelValue: 'hz', clearable: true } })
    expect(wrapper.find('.kb-treeselect__clear').exists()).toBe(true)
    await wrapper.find('.kb-treeselect__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('disabled 时不可展开', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, disabled: true } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    expect(wrapper.find('.kb-treeselect__panel').exists()).toBe(false)
  })

  it('无选项时展示无匹配提示', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: [] } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    expect(wrapper.find('.kb-treeselect__empty').text()).toBe('无匹配数据')
  })

  it('节点带无障碍属性', async () => {
    const wrapper = mount(KbTreeSelect, { props: { options: TREE, modelValue: 'zj' } })
    await wrapper.find('.kb-treeselect__control').trigger('click')
    const first = wrapper.findAll('.kb-treeselect__node')[0]
    expect(first.attributes('role')).toBe('treeitem')
    expect(first.attributes('aria-selected')).toBe('true')
    expect(first.attributes('aria-expanded')).toBe('false')
  })
})
