import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbResult from '../Result.vue'

describe('KbResult', () => {
  it('渲染默认成功状态', () => {
    const wrapper = mount(KbResult, { props: { title: '操作成功' } })
    expect(wrapper.find('.kb-result__icon').exists()).toBe(true)
    expect(wrapper.find('.kb-result__title').text()).toContain('操作成功')
  })

  it('status=error 应用对应 class', () => {
    const wrapper = mount(KbResult, { props: { status: 'error', title: '出错了' } })
    expect(wrapper.find('.kb-result__icon').classes()).toContain('kb-result__icon--error')
  })

  it('渲染描述与操作插槽', () => {
    const wrapper = mount(KbResult, {
      props: { title: '成功', description: '详情说明' },
      slots: { action: '<KbButton type="primary">返回</KbButton>' },
    })
    expect(wrapper.find('.kb-result__description').text()).toContain('详情说明')
    expect(wrapper.find('.kb-result__action').exists()).toBe(true)
  })
})
