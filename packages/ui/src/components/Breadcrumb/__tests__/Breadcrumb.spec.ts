import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbBreadcrumb from '../Breadcrumb.vue'

const items = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/components' },
  { label: 'Breadcrumb' },
]

describe('KbBreadcrumb', () => {
  it('渲染所有层级', () => {
    const wrapper = mount(KbBreadcrumb, { props: { items } })
    expect(wrapper.findAll('.kb-breadcrumb__item')).toHaveLength(3)
  })

  it('最后一个层级无链接', () => {
    const wrapper = mount(KbBreadcrumb, { props: { items } })
    const links = wrapper.findAll('.kb-breadcrumb__item a')
    expect(links).toHaveLength(2)
    expect(wrapper.find('.kb-breadcrumb__item:last-child').classes()).toContain(
      'kb-breadcrumb__item--current',
    )
  })

  it('有 href 的项渲染为链接', () => {
    const wrapper = mount(KbBreadcrumb, { props: { items } })
    expect(wrapper.find('a').attributes('href')).toBe('/')
  })

  it('分隔符默认 /', () => {
    const wrapper = mount(KbBreadcrumb, { props: { items } })
    expect(wrapper.find('.kb-breadcrumb__separator').text()).toBe('/')
  })
})
