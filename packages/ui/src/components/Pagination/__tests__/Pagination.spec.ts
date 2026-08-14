import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbPagination from '../Pagination.vue'

describe('KbPagination', () => {
  it('渲染页码', () => {
    const wrapper = mount(KbPagination, { props: { total: 50, pageSize: 10 } })
    // 5 页：1 2 3 4 5
    expect(wrapper.findAll('.kb-pagination__item')).toHaveLength(5)
  })

  it('点击页码触发 update:currentPage', async () => {
    const wrapper = mount(KbPagination, { props: { total: 50, pageSize: 10 } })
    await wrapper.findAll('.kb-pagination__item')[2].trigger('click')
    expect(wrapper.emitted('update:currentPage')![0]).toEqual([3])
  })

  it('上一页/下一页', async () => {
    const wrapper = mount(KbPagination, {
      props: { total: 50, pageSize: 10, currentPage: 3 },
    })
    await wrapper.find('.kb-pagination__prev').trigger('click')
    expect(wrapper.emitted('update:currentPage')![0]).toEqual([2])
    await wrapper.find('.kb-pagination__next').trigger('click')
    expect(wrapper.emitted('update:currentPage')![1]).toEqual([4])
  })

  it('首页不触发上一页', async () => {
    const wrapper = mount(KbPagination, { props: { total: 50, pageSize: 10, currentPage: 1 } })
    await wrapper.find('.kb-pagination__prev').trigger('click')
    expect(wrapper.emitted('update:currentPage')).toBeUndefined()
  })

  it('显示总数', () => {
    const wrapper = mount(KbPagination, { props: { total: 50, pageSize: 10 } })
    expect(wrapper.text()).toContain('共 50 条')
  })
})
