import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTree from '../Tree.vue'
import type { TreeNode } from '../Tree.vue'

const data = [
  { label: '前端', children: [{ label: 'Vue', children: [{ label: 'Vue3' }] }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }] },
]

const bigData: TreeNode[] = Array.from({ length: 200 }, (_, i) => ({ label: `节点 ${i}` }))

function rect(height = 32): DOMRect {
  return {
    top: 0,
    bottom: height,
    height,
    left: 0,
    right: 100,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect
}

describe('KbTree', () => {
  it('渲染顶层节点', () => {
    const wrapper = mount(KbTree, { props: { data } })
    expect(wrapper.findAll('.kb-tree__row')).toHaveLength(2)
  })

  it('展开显示子节点', async () => {
    const wrapper = mount(KbTree, { props: { data } })
    await wrapper.find('.kb-tree__toggle').trigger('click')
    // 展开"前端"：前端 + Vue + React + 后端 = 4 行
    expect(wrapper.findAll('.kb-tree__row')).toHaveLength(4)
  })

  it('选中节点', async () => {
    const wrapper = mount(KbTree, { props: { data } })
    await wrapper.findAll('.kb-tree__label')[1].trigger('click')
    expect(wrapper.findAll('.kb-tree__label')[1].classes()).toContain('kb-tree__label--selected')
  })

  it('defaultExpandAll 展开全部节点', () => {
    const wrapper = mount(KbTree, { props: { data, defaultExpandAll: true } })
    // 前端 / Vue / Vue3 / React / 后端 / Node
    expect(wrapper.findAll('.kb-tree__row')).toHaveLength(6)
  })

  it('虚拟滚动只渲染可视区节点', () => {
    const wrapper = mount(KbTree, { props: { data: bigData, height: 160, itemHeight: 32 } })
    const rows = wrapper.findAll('.kb-tree__row')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(200)
    // 内层撑满总高度：200 * 32 = 6400px
    expect(wrapper.find('.kb-tree__inner').attributes('style')).toContain('6400px')
  })

  it('虚拟滚动跟随滚动位置下移渲染窗口', async () => {
    const wrapper = mount(KbTree, { props: { data: bigData, height: 160, itemHeight: 32 } })
    const firstBefore = wrapper.findAll('.kb-tree__label')[0].text()
    const scroller = wrapper.find('.kb-tree__scroll').element as HTMLElement
    scroller.scrollTop = 320
    await wrapper.find('.kb-tree__scroll').trigger('scroll')
    const firstAfter = wrapper.findAll('.kb-tree__label')[0].text()
    expect(firstAfter).not.toBe(firstBefore)
    expect(wrapper.findAll('.kb-tree__row').length).toBeLessThan(200)
  })

  it('拖拽移动节点到目标之后并派发 drop', async () => {
    const wrapper = mount(KbTree, {
      props: { data: [{ label: 'A' }, { label: 'B' }], draggable: true },
    })
    await wrapper.findAll('.kb-tree__row')[0].trigger('dragstart', {
      dataTransfer: { setData: () => {}, effectAllowed: '' },
    })
    const target = wrapper.findAll('.kb-tree__row')[1]
    ;(target.element as HTMLElement).getBoundingClientRect = () => rect(32)
    await target.trigger('dragover', { clientY: 30 })
    await target.trigger('drop')

    const payload = wrapper.emitted('drop')?.[0]?.[0] as {
      position: string
      data: TreeNode[]
    }
    expect(payload).toBeTruthy()
    expect(payload.position).toBe('after')
    expect(payload.data.map((n) => n.label)).toEqual(['B', 'A'])
  })

  it('allowDrop 返回 false 时禁止落点', async () => {
    const wrapper = mount(KbTree, {
      props: {
        data: [{ label: 'A' }, { label: 'B' }],
        draggable: true,
        allowDrop: () => false,
      },
    })
    await wrapper.findAll('.kb-tree__row')[0].trigger('dragstart', {
      dataTransfer: { setData: () => {}, effectAllowed: '' },
    })
    const target = wrapper.findAll('.kb-tree__row')[1]
    ;(target.element as HTMLElement).getBoundingClientRect = () => rect(32)
    await target.trigger('dragover', { clientY: 30 })
    await target.trigger('drop')
    expect(wrapper.emitted('drop')).toBeFalsy()
  })

  it('禁止把节点拖进自己的子孙节点', async () => {
    const wrapper = mount(KbTree, {
      props: {
        draggable: true,
        defaultExpandAll: true,
        data: [{ label: '父', children: [{ label: '子' }] }],
      },
    })
    await wrapper.findAll('.kb-tree__row')[0].trigger('dragstart', {
      dataTransfer: { setData: () => {}, effectAllowed: '' },
    })
    const child = wrapper.findAll('.kb-tree__row')[1]
    ;(child.element as HTMLElement).getBoundingClientRect = () => rect(32)
    await child.trigger('dragover', { clientY: 16 })
    await child.trigger('drop')
    expect(wrapper.emitted('drop')).toBeFalsy()
  })
})
