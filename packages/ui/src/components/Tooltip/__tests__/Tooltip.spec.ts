import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbTooltip from '../Tooltip.vue'

describe('KbTooltip', () => {
  it('默认不显示内容', () => {
    const wrapper = mount(KbTooltip, {
      props: { content: '提示' },
      slots: { default: '<button>hover</button>' },
    })
    expect(wrapper.find('.kb-tooltip__popper').exists()).toBe(false)
  })

  it('hover 后显示 content', async () => {
    const wrapper = mount(KbTooltip, {
      props: { content: '提示文字' },
      slots: { default: '<button>hover</button>' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.kb-tooltip__popper').exists()).toBe(true)
    expect(wrapper.find('.kb-tooltip__popper').text()).toContain('提示文字')
  })

  it('mouseleave 后隐藏', async () => {
    const wrapper = mount(KbTooltip, {
      props: { content: '提示' },
      slots: { default: '<button>hover</button>' },
    })
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')
    expect(wrapper.find('.kb-tooltip__popper').exists()).toBe(false)
  })

  it('click trigger 切换显示', async () => {
    const wrapper = mount(KbTooltip, {
      props: { content: '提示', trigger: 'click' },
      slots: { default: '<button>click</button>' },
    })
    await wrapper.trigger('click')
    expect(wrapper.find('.kb-tooltip__popper').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.find('.kb-tooltip__popper').exists()).toBe(false)
  })

  it('disabled 不显示', async () => {
    const wrapper = mount(KbTooltip, {
      props: { content: '提示', disabled: true },
      slots: { default: '<button>hover</button>' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.kb-tooltip__popper').exists()).toBe(false)
  })
})
