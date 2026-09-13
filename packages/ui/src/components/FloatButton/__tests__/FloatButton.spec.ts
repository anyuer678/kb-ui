import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbFloatButton from '../FloatButton.vue'
import KbFloatButtonGroup from '../FloatButtonGroup.vue'

describe('KbFloatButton', () => {
  it('默认渲染为 button，带圆形与默认尺寸修饰类', () => {
    const wrapper = mount(KbFloatButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('kb-float-button--circle')
    expect(wrapper.classes()).toContain('kb-float-button--default')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('传入 href 时渲染为链接并带上 target', () => {
    const wrapper = mount(KbFloatButton, { props: { href: 'https://example.com', target: '_blank' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('tooltip 作为 aria-label 与 title', () => {
    const wrapper = mount(KbFloatButton, { props: { tooltip: '回到顶部' } })
    expect(wrapper.attributes('aria-label')).toBe('回到顶部')
    expect(wrapper.attributes('title')).toBe('回到顶部')
  })

  it('点击派发 click', async () => {
    const wrapper = mount(KbFloatButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('disabled 时点击不派发', async () => {
    const wrapper = mount(KbFloatButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('loading 时点击不派发且标记 aria-busy', async () => {
    const wrapper = mount(KbFloatButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('type/size 修饰类正确，default 不产生类型修饰类', () => {
    const primary = mount(KbFloatButton, { props: { type: 'primary', size: 'large' } })
    expect(primary.classes()).toContain('kb-float-button--primary')
    expect(primary.classes()).toContain('kb-float-button--large')

    const plain = mount(KbFloatButton, { props: { type: 'default' } })
    expect(plain.classes()).not.toContain('kb-float-button--primary')
  })

  it('渲染图标与描述文案', () => {
    const wrapper = mount(KbFloatButton, { props: { icon: 'plus', description: '新建' } })
    expect(wrapper.find('.kb-icon').exists()).toBe(true)
    expect(wrapper.find('.kb-float-button__description').text()).toBe('新建')
  })
})

describe('KbFloatButtonGroup', () => {
  it('默认收起，点击触发器展开并派发 update:open', async () => {
    const wrapper = mount(KbFloatButtonGroup)
    expect(wrapper.classes()).not.toContain('kb-float-button-group--open')
    expect(wrapper.find('.kb-float-button-group__trigger').attributes('aria-expanded')).toBe('false')

    await wrapper.find('.kb-float-button-group__trigger').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.classes()).toContain('kb-float-button-group--open')
  })

  it('支持 v-model 受控展开', async () => {
    const wrapper = mount(KbFloatButtonGroup, { props: { open: true } })
    expect(wrapper.classes()).toContain('kb-float-button-group--open')
    await wrapper.setProps({ open: false })
    expect(wrapper.classes()).not.toContain('kb-float-button-group--open')
  })

  it('hover 触发方式：移入展开、移出收起', async () => {
    const wrapper = mount(KbFloatButtonGroup, { props: { trigger: 'hover' } })
    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).toContain('kb-float-button-group--open')
    await wrapper.trigger('mouseleave')
    expect(wrapper.classes()).not.toContain('kb-float-button-group--open')
  })

  it('click 触发方式不受悬浮影响', async () => {
    const wrapper = mount(KbFloatButtonGroup)
    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).not.toContain('kb-float-button-group--open')
  })

  it('渲染方向修饰类与子项插槽', () => {
    const wrapper = mount(KbFloatButtonGroup, {
      props: { direction: 'right' },
      slots: { default: '<span class="item">A</span>' },
    })
    expect(wrapper.classes()).toContain('kb-float-button-group--right')
    expect(wrapper.find('.kb-float-button-group__items .item').exists()).toBe(true)
  })

  it('触发器带无障碍展开状态与自定义 tooltip', () => {
    const wrapper = mount(KbFloatButtonGroup, { props: { tooltip: '更多操作' } })
    expect(wrapper.find('.kb-float-button-group__trigger').attributes('aria-label')).toBe('更多操作')
  })
})
