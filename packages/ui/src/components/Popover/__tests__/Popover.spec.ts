import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbPopover from '../Popover.vue'

describe('KbPopover', () => {
  it('默认不显示气泡', () => {
    const wrapper = mount(KbPopover, {
      props: { content: '气泡内容' },
      slots: { default: '<button>hover</button>' },
    })
    expect(wrapper.find('.kb-popover__content').exists()).toBe(false)
  })

  it('hover 后显示内容', async () => {
    const wrapper = mount(KbPopover, {
      props: { content: '气泡内容' },
      slots: { default: '<button>hover</button>' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.kb-popover__content').text()).toContain('气泡内容')
  })

  it('click trigger 切换', async () => {
    const wrapper = mount(KbPopover, {
      props: { content: '内容', trigger: 'click' },
      slots: { default: '<button>click</button>' },
    })
    await wrapper.trigger('click')
    expect(wrapper.find('.kb-popover__content').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.find('.kb-popover__content').exists()).toBe(false)
  })

  it('渲染标题', async () => {
    const wrapper = mount(KbPopover, {
      props: { title: '标题', content: '内容' },
      slots: { default: '<button>hover</button>' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.kb-popover__title').text()).toContain('标题')
  })
})
