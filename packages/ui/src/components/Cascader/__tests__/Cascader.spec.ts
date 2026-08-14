import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCascader from '../Cascader.vue'

const options = [
  { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }, { label: '宁波', value: 'nb' }] },
  { label: '广东', value: 'gd', children: [{ label: '广州', value: 'gz' }] },
]

describe('KbCascader', () => {
  it('渲染第一级', () => {
    const wrapper = mount(KbCascader, { props: { options } })
    expect(wrapper.findAll('.kb-cascader__trigger').length).toBeGreaterThan(0)
  })

  it('点击展开子级', async () => {
    const wrapper = mount(KbCascader, { props: { options } })
    await wrapper.find('.kb-cascader__trigger').trigger('click')
    expect(wrapper.findAll('.kb-cascader__option').length).toBeGreaterThan(0)
  })
})
