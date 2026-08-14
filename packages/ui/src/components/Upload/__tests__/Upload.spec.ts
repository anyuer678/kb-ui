import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbUpload from '../Upload.vue'

describe('KbUpload', () => {
  it('渲染选择按钮', () => {
    const wrapper = mount(KbUpload)
    expect(wrapper.find('.kb-upload__button').exists()).toBe(true)
  })

  it('选择文件加入列表', async () => {
    const wrapper = mount(KbUpload)
    const file = new File(['x'], 'test.txt', { type: 'text/plain' })
    Object.defineProperty(wrapper.find('input').element, 'files', { value: [file] })
    await wrapper.find('input').trigger('change')
    expect(wrapper.find('.kb-upload__name').text()).toContain('test.txt')
  })

  it('删除文件', async () => {
    const wrapper = mount(KbUpload)
    const file = new File(['x'], 'test.txt', { type: 'text/plain' })
    Object.defineProperty(wrapper.find('input').element, 'files', { value: [file] })
    await wrapper.find('input').trigger('change')
    await wrapper.find('.kb-upload__delete').trigger('click')
    expect(wrapper.find('.kb-upload__item').exists()).toBe(false)
  })
})
