import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import KbLayout from '../Layout.vue'
import KbHeader from '../Header.vue'
import KbSider from '../Sider.vue'
import KbContent from '../Content.vue'
import KbFooter from '../Footer.vue'

describe('KbLayout', () => {
  it('默认（无 Sider）为纵向布局', () => {
    const wrapper = mount(KbLayout)
    expect(wrapper.classes()).toContain('kb-layout--vertical')
  })

  it('含 Sider 时自动切换为横向布局', async () => {
    const wrapper = mount(KbLayout, {
      slots: { default: '<KbSider>侧边</KbSider><KbContent>内容</KbContent>' },
      global: { components: { KbSider, KbContent } },
    })
    // Sider 在 onMounted 时登记，断言前先等一次重渲染
    await nextTick()
    expect(wrapper.classes()).toContain('kb-layout--horizontal')
  })

  it('显式 direction 覆盖自动判断', () => {
    const wrapper = mount(KbLayout, {
      props: { direction: 'vertical' },
      slots: { default: '<KbSider>侧边</KbSider>' },
      global: { components: { KbSider } },
    })
    expect(wrapper.classes()).toContain('kb-layout--vertical')
  })

  it('Header / Content / Footer 渲染为语义化标签', () => {
    const wrapper = mount(KbLayout, {
      slots: {
        default: '<KbHeader>头</KbHeader><KbContent>内容</KbContent><KbFooter>尾</KbFooter>',
      },
      global: { components: { KbHeader, KbContent, KbFooter } },
    })
    expect(wrapper.find('header.kb-layout__header').exists()).toBe(true)
    expect(wrapper.find('main.kb-layout__content').exists()).toBe(true)
    expect(wrapper.find('footer.kb-layout__footer').exists()).toBe(true)
  })
})

describe('KbSider', () => {
  it('展开时使用 width，收起时使用 collapsedWidth', () => {
    const open = mount(KbSider, { props: { width: 240, collapsedWidth: 80 } })
    expect((open.element as HTMLElement).style.width).toBe('240px')

    const closed = mount(KbSider, { props: { width: 240, collapsedWidth: 80, collapsed: true } })
    expect((closed.element as HTMLElement).style.width).toBe('80px')
    expect(closed.classes()).toContain('kb-layout__sider--collapsed')
  })

  it('collapsible 为 false 时不渲染触发器', () => {
    const wrapper = mount(KbSider)
    expect(wrapper.find('.kb-layout__sider-trigger').exists()).toBe(false)
  })

  it('点击触发器派发 update:collapsed 与 collapse', async () => {
    const wrapper = mount(KbSider, { props: { collapsible: true, collapsed: false } })
    await wrapper.find('.kb-layout__sider-trigger').trigger('click')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
    expect(wrapper.emitted('collapse')?.[0]).toEqual([true, 'clickTrigger'])
  })

  it('触发器具备无障碍标注与展开状态', async () => {
    const wrapper = mount(KbSider, { props: { collapsible: true } })
    const trigger = wrapper.find('.kb-layout__sider-trigger')
    expect(trigger.attributes('role')).toBe('button')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-label')).toBe('收起侧边栏')

    await wrapper.setProps({ collapsed: true })
    expect(wrapper.find('.kb-layout__sider-trigger').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.kb-layout__sider-trigger').attributes('aria-label')).toBe('展开侧边栏')
  })

  it('键盘 Enter 可切换折叠', async () => {
    const wrapper = mount(KbSider, { props: { collapsible: true } })
    await wrapper.find('.kb-layout__sider-trigger').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
  })

  it('Sider 卸载后 Layout 回退为纵向（注销生效）', async () => {
    const Host = defineComponent({
      components: { KbLayout, KbSider },
      data: () => ({ show: true }),
      template: '<KbLayout><KbSider v-if="show">侧边</KbSider>内容</KbLayout>',
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('.kb-layout').classes()).toContain('kb-layout--horizontal')

    await wrapper.setData({ show: false })
    expect(wrapper.find('.kb-layout').classes()).toContain('kb-layout--vertical')
  })
})
