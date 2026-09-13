import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbVirtualList from '../VirtualList.vue'

/** 构造 n 条数据 */
function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i, label: `第 ${i} 项` }))
}

describe('KbVirtualList', () => {
  it('只渲染视口内的项，而不是全量', () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: makeItems(1000), itemHeight: 40, height: 400, buffer: 0 },
    })
    // 400 / 40 = 10 项
    expect(wrapper.findAll('.kb-virtual-list__item')).toHaveLength(10)
    // 占位高度 = 1000 * 40
    expect((wrapper.find('.kb-virtual-list__phantom').element as HTMLElement).style.height).toBe(
      '40000px',
    )
  })

  it('首屏从索引 0 开始', () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: makeItems(100), itemHeight: 40, height: 400, buffer: 0 },
      slots: { item: '<template #item="{ item }">{{ item.label }}</template>' },
    })
    expect(wrapper.find('.kb-virtual-list__item').text()).toContain('第 0 项')
  })

  it('滚动后按索引窗口渲染并偏移内容区', async () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: makeItems(100), itemHeight: 40, height: 400, buffer: 0 },
      slots: { item: '<template #item="{ item }">{{ item.label }}</template>' },
    })
    const container = wrapper.find('.kb-virtual-list')
    Object.defineProperty(container.element, 'scrollTop', { value: 400, writable: true, configurable: true })
    Object.defineProperty(container.element, 'clientHeight', { value: 400, configurable: true })
    Object.defineProperty(container.element, 'scrollHeight', { value: 4000, configurable: true })

    await container.trigger('scroll')
    // 400 / 40 = 第 10 项起
    expect(wrapper.find('.kb-virtual-list__item').text()).toContain('第 10 项')
    expect((wrapper.find('.kb-virtual-list__content').element as HTMLElement).style.transform).toBe(
      'translateY(400px)',
    )
    expect(wrapper.emitted('scroll')?.[0]).toEqual([400])
  })

  it('buffer 会额外渲染上下若干项', () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: makeItems(1000), itemHeight: 40, height: 400, buffer: 5 },
    })
    // 10 + 5*2 = 20（首屏起始索引为 0，上缓冲区被裁掉）
    expect(wrapper.findAll('.kb-virtual-list__item').length).toBeLessThanOrEqual(20)
    expect(wrapper.findAll('.kb-virtual-list__item').length).toBeGreaterThan(10)
  })

  it('数据为空时渲染空态插槽', () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: [], itemHeight: 40, height: 200 },
      slots: { empty: '没有数据' },
    })
    expect(wrapper.find('.kb-virtual-list__empty').text()).toBe('没有数据')
    expect(wrapper.findAll('.kb-virtual-list__item')).toHaveLength(0)
  })

  it('滚动到底部派发 reachEnd', async () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: makeItems(50), itemHeight: 40, height: 400 },
    })
    const container = wrapper.find('.kb-virtual-list')
    Object.defineProperty(container.element, 'scrollTop', { value: 1600, writable: true, configurable: true })
    Object.defineProperty(container.element, 'clientHeight', { value: 400, configurable: true })
    Object.defineProperty(container.element, 'scrollHeight', { value: 2000, configurable: true })

    await container.trigger('scroll')
    expect(wrapper.emitted('reachEnd')).toHaveLength(1)
  })

  it('item 插槽能拿到 item 与 index', () => {
    const wrapper = mount(KbVirtualList, {
      props: { items: makeItems(10), itemHeight: 40, height: 200, buffer: 0 },
      slots: { item: '<template #item="{ item, index }">{{ index }}:{{ item.label }}</template>' },
    })
    expect(wrapper.find('.kb-virtual-list__item').text()).toBe('0:第 0 项')
  })
})
