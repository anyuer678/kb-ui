import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbList from '../List.vue'

const items = ['苹果', '香蕉', '橙子']

describe('KbList', () => {
  it('渲染列表项', () => {
    const wrapper = mount(KbList, { props: { items } })
    expect(wrapper.findAll('.kb-list__item')).toHaveLength(3)
  })

  it('自定义插槽渲染', () => {
    const wrapper = mount(KbList, {
      props: { items },
      slots: { item: '<template #item="{ item }">【{{ item }}】</template>' },
    })
    expect(wrapper.find('.kb-list__item').text()).toContain('【苹果】')
  })

  it('empty 文案', () => {
    const wrapper = mount(KbList, { props: { items: [] } })
    expect(wrapper.text()).toContain('暂无数据')
  })
})
