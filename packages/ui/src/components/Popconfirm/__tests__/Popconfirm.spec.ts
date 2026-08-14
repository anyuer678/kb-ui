import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbPopconfirm from '../Popconfirm.vue'

const stubTeleport = { global: { stubs: { teleport: true } } }

describe('KbPopconfirm', () => {
  it('默认不显示气泡', () => {
    const wrapper = mount(KbPopconfirm, {
      props: { title: '确认删除？' },
      slots: { default: '<button>删除</button>' },
      ...stubTeleport,
    })
    expect(wrapper.find('.kb-popconfirm__panel').exists()).toBe(false)
  })

  it('点击触发显示', async () => {
    const wrapper = mount(KbPopconfirm, {
      props: { title: '确认删除？' },
      slots: { default: '<button>删除</button>' },
      ...stubTeleport,
    })
    await wrapper.trigger('click')
    expect(wrapper.find('.kb-popconfirm__title').text()).toContain('确认删除？')
  })

  it('点击确定触发 confirm', async () => {
    const wrapper = mount(KbPopconfirm, {
      props: { title: '确认？' },
      slots: { default: '<button>x</button>' },
      ...stubTeleport,
    })
    await wrapper.trigger('click')
    await wrapper.find('.kb-popconfirm__ok').trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.find('.kb-popconfirm__panel').exists()).toBe(false)
  })

  it('点击取消触发 cancel', async () => {
    const wrapper = mount(KbPopconfirm, {
      props: { title: '确认？' },
      slots: { default: '<button>x</button>' },
      ...stubTeleport,
    })
    await wrapper.trigger('click')
    await wrapper.find('.kb-popconfirm__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
