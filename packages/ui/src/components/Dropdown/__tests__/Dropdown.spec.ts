import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbDropdown from '../Dropdown.vue'

const items = [
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete', danger: true },
  { label: '禁用项', key: 'disabled', disabled: true },
]

describe('KbDropdown', () => {
  it('默认不显示菜单', () => {
    const wrapper = mount(KbDropdown, {
      props: { items },
      slots: { default: '<button>操作</button>' },
    })
    expect(wrapper.find('.kb-dropdown__menu').exists()).toBe(false)
  })

  it('hover 后显示菜单', async () => {
    const wrapper = mount(KbDropdown, {
      props: { items },
      slots: { default: '<button>操作</button>' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.findAll('.kb-dropdown__item')).toHaveLength(3)
  })

  it('点击菜单项触发 select 事件', async () => {
    const wrapper = mount(KbDropdown, {
      props: { items },
      slots: { default: '<button>操作</button>' },
    })
    await wrapper.trigger('mouseenter')
    await wrapper.findAll('.kb-dropdown__item')[0].trigger('click')
    expect(wrapper.emitted('select')![0]).toEqual(['edit'])
  })

  it('disabled 项不可点击', async () => {
    const wrapper = mount(KbDropdown, {
      props: { items },
      slots: { default: '<button>操作</button>' },
    })
    await wrapper.trigger('mouseenter')
    await wrapper.findAll('.kb-dropdown__item')[2].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
