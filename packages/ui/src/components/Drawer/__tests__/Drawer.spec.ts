import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbDrawer from '../Drawer.vue'

const stubTeleport = { global: { stubs: { teleport: true } } }

describe('KbDrawer', () => {
  it('modelValue=false 时不渲染', () => {
    const wrapper = mount(KbDrawer, {
      props: { modelValue: false },
      slots: { default: '内容' },
      ...stubTeleport,
    })
    expect(wrapper.find('.kb-drawer').exists()).toBe(false)
  })

  it('渲染标题与内容', () => {
    const wrapper = mount(KbDrawer, {
      props: { modelValue: true, title: '抽屉标题' },
      slots: { default: '抽屉内容' },
      ...stubTeleport,
    })
    expect(wrapper.find('.kb-drawer__header').text()).toContain('抽屉标题')
    expect(wrapper.find('.kb-drawer__body').text()).toContain('抽屉内容')
  })

  it('点击遮罩触发关闭', async () => {
    const wrapper = mount(KbDrawer, {
      props: { modelValue: true },
      ...stubTeleport,
    })
    await wrapper.find('.kb-drawer-overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('direction=right 应用右侧 class', () => {
    const wrapper = mount(KbDrawer, {
      props: { modelValue: true, direction: 'right' },
      ...stubTeleport,
    })
    expect(wrapper.find('.kb-drawer').classes()).toContain('kb-drawer--right')
  })
})
