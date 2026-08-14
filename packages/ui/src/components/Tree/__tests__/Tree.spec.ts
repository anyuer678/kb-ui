import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTree from '../Tree.vue'

const data = [
  { label: '前端', children: [{ label: 'Vue', children: [{ label: 'Vue3' }] }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }] },
]

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
})
