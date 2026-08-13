import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbDialog from '../Dialog.vue'

describe('KbDialog', () => {
  it('modelValue=false 时不渲染', () => {
    const wrapper = mount(KbDialog, {
      props: { modelValue: false },
      slots: { default: '内容' },
    })
    expect(wrapper.find('.kb-dialog').exists()).toBe(false)
  })

  it('modelValue=true 渲染标题与插槽', () => {
    const wrapper = mount(KbDialog, {
      props: { modelValue: true, title: '标题' },
      slots: { default: '内容' },
    })
    expect(wrapper.find('.kb-dialog__header').text()).toContain('标题')
    expect(wrapper.find('.kb-dialog__body').text()).toContain('内容')
  })

  it('点击遮罩触发 update:modelValue=false', async () => {
    const wrapper = mount(KbDialog, {
      props: { modelValue: true, closeOnClickOverlay: true },
    })
    await wrapper.find('.kb-dialog-overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('渲染 footer 插槽', () => {
    const wrapper = mount(KbDialog, {
      props: { modelValue: true },
      slots: { footer: '<button>确定</button>' },
    })
    expect(wrapper.find('.kb-dialog__footer button').text()).toContain('确定')
  })
})
