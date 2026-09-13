import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbAutoComplete from '../AutoComplete.vue'

const OPTIONS = ['Apple', 'Banana', 'Cherry']

/**
 * 受控组件：本地过滤读的是 modelValue prop，
 * 所以模拟输入后还要把 prop 同步过去，等价于父组件 v-model 回写。
 */
async function type(wrapper: ReturnType<typeof mount>, text: string) {
  const input = wrapper.find('input')
  await input.setValue(text)
  await wrapper.setProps({ modelValue: text })
  await nextTick()
  return input
}

describe('KbAutoComplete', () => {
  it('聚焦后展示全部候选（未输入时不过滤）', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.kb-autocomplete__option')).toHaveLength(3)
  })

  it('输入后按内容本地过滤', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    await wrapper.find('input').trigger('focus')
    await type(wrapper, 'an')

    const labels = wrapper.findAll('.kb-autocomplete__option').map((n) => n.text())
    expect(labels).toEqual(['Banana'])
  })

  it('过滤不区分大小写', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    await wrapper.find('input').trigger('focus')
    await type(wrapper, 'CH')
    expect(wrapper.findAll('.kb-autocomplete__option').map((n) => n.text())).toEqual(['Cherry'])
  })

  it('filter=false 时不做本地过滤', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS, filter: false } })
    await wrapper.find('input').trigger('focus')
    await type(wrapper, 'zzz')
    expect(wrapper.findAll('.kb-autocomplete__option')).toHaveLength(3)
  })

  it('点击候选项回填并派发 select', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    await wrapper.find('input').trigger('focus')
    await wrapper.findAll('.kb-autocomplete__option')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Banana'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'Banana' })
    expect(wrapper.find('.kb-autocomplete__panel').exists()).toBe(false)
  })

  it('支持 { value, label } 结构并展示 label', async () => {
    const wrapper = mount(KbAutoComplete, {
      props: { options: [{ value: 'a1', label: '苹果' }, { value: 'b1', label: '香蕉' }] },
    })
    await wrapper.find('input').trigger('focus')
    const labels = wrapper.findAll('.kb-autocomplete__option').map((n) => n.text())
    expect(labels).toEqual(['苹果', '香蕉'])
  })

  it('键盘上下移动高亮，回车选中', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findAll('.kb-autocomplete__option--active')).toHaveLength(1)
    expect(wrapper.find('.kb-autocomplete__option--active').text()).toBe('Banana')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Banana'])
  })

  it('高亮到末项后继续下移会回到首项', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    // 起始 activeIndex = -1，按 4 次正好绕一圈回到第一项
    for (let i = 0; i < OPTIONS.length + 1; i += 1) {
      await input.trigger('keydown', { key: 'ArrowDown' })
    }
    expect(wrapper.find('.kb-autocomplete__option--active').text()).toBe('Apple')
  })

  it('ArrowUp 从无高亮直接跳到末项', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('.kb-autocomplete__option--active').text()).toBe('Cherry')
  })

  it('无匹配时展示提示文案', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    await wrapper.find('input').trigger('focus')
    await type(wrapper, 'zzz')
    expect(wrapper.find('.kb-autocomplete__empty').text()).toBe('无匹配数据')
  })

  it('禁用项不可选中', async () => {
    const wrapper = mount(KbAutoComplete, {
      props: {
        options: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B' },
        ],
      },
    })
    await wrapper.find('input').trigger('focus')
    await wrapper.findAll('.kb-autocomplete__option')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clearable 可清空', async () => {
    const wrapper = mount(KbAutoComplete, { props: { modelValue: 'Apple', options: OPTIONS, clearable: true } })
    expect(wrapper.find('.kb-autocomplete__clear').exists()).toBe(true)
    await wrapper.find('.kb-autocomplete__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('fetchSuggestions 走远程候选', async () => {
    const fetchSuggestions = vi.fn().mockResolvedValue([{ value: 'remote', label: '远程结果' }])
    const wrapper = mount(KbAutoComplete, {
      props: { options: OPTIONS, fetchSuggestions },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('re')
    await wrapper.setProps({ modelValue: 're' })
    await nextTick()
    await nextTick()

    expect(fetchSuggestions).toHaveBeenCalledWith('re')
    const labels = wrapper.findAll('.kb-autocomplete__option').map((n) => n.text())
    expect(labels).toEqual(['远程结果'])
  })

  it('Esc 关闭面板', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.find('.kb-autocomplete__panel').exists()).toBe(true)
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.kb-autocomplete__panel').exists()).toBe(false)
  })

  it('无障碍属性完整', async () => {
    const wrapper = mount(KbAutoComplete, { props: { options: OPTIONS } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-controls')).toBe(wrapper.find('.kb-autocomplete__panel').attributes('id'))
  })
})
