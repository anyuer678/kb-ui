import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbMentions from '../Mentions.vue'
import type { MentionOption } from '../types'

const OPTIONS: MentionOption[] = [
  { value: 'alice' },
  { value: 'bob', label: '鲍勃' },
  { value: 'carol' },
  { value: 'dave', disabled: true },
]

/**
 * 模拟输入：设置 DOM 值 + 光标，触发 input，再由「父组件」回写 modelValue。
 * 回写这一步不能省——textarea 是受控的，父组件不更新 modelValue 时，
 * 重渲染会把 DOM value 打回旧值（这是 Vue 的受控行为，不是组件缺陷）。
 */
async function type(wrapper: ReturnType<typeof mount>, value: string, caretPos = value.length) {
  const textarea = wrapper.find('textarea')
  const el = textarea.element as HTMLTextAreaElement
  el.value = value
  el.setSelectionRange(caretPos, caretPos)
  await textarea.trigger('input')
  await wrapper.setProps({ modelValue: value })
  el.setSelectionRange(caretPos, caretPos)
  await nextTick()
}

describe('KbMentions', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('初始不展开候选面板', () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    expect(wrapper.find('.kb-mentions__dropdown').exists()).toBe(false)
  })

  it('输入触发前缀后展开并过滤候选项', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, '你好 @ali')
    expect(wrapper.find('.kb-mentions__dropdown').exists()).toBe(true)
    expect(wrapper.findAll('.kb-mentions__option')).toHaveLength(1)
    expect(wrapper.find('.kb-mentions__option').text()).toBe('alice')
  })

  it('无匹配时展示空态文案', async () => {
    const wrapper = mount(KbMentions, {
      props: { options: OPTIONS, notFoundContent: '查无此人' },
    })
    await type(wrapper, '@zzz')
    expect(wrapper.find('.kb-mentions__empty').text()).toBe('查无此人')
  })

  it('前缀位于词中（前一个字符非空白）不触发', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, 'a@al')
    expect(wrapper.find('.kb-mentions__dropdown').exists()).toBe(false)
  })

  it('选中候选项后替换片段并派发 select', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, '你好 @ali')
    await wrapper.find('.kb-mentions__option').trigger('mousedown')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['你好 @alice '])
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({ value: 'alice' })
    expect(wrapper.emitted('select')?.[0]?.[1]).toBe('@')
    // 选中后关闭
    await nextTick()
    expect(wrapper.find('.kb-mentions__dropdown').exists()).toBe(false)
  })

  it('方向键移动高亮项，回车选中', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, '@')
    expect(wrapper.findAll('.kb-mentions__option')[0].classes()).toContain(
      'kb-mentions__option--active',
    )

    await wrapper.find('textarea').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findAll('.kb-mentions__option')[1].classes()).toContain(
      'kb-mentions__option--active',
    )

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({ value: 'bob', label: '鲍勃' })
  })

  it('Escape 关闭候选面板', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, '@')
    await wrapper.find('textarea').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.kb-mentions__dropdown').exists()).toBe(false)
  })

  it('禁用项不出现在候选中', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, '@d')
    expect(wrapper.find('.kb-mentions__empty').exists()).toBe(true)
  })

  it('支持自定义前缀与自定义过滤', async () => {
    const wrapper = mount(KbMentions, {
      props: {
        options: OPTIONS,
        prefix: '#',
        filterOption: (search, option) => option.value.endsWith(search),
      },
    })
    await type(wrapper, '#b')
    expect(wrapper.findAll('.kb-mentions__option').map((o) => o.text())).toEqual(['鲍勃'])
  })

  it('派发 search 事件', async () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS } })
    await type(wrapper, '@bo')
    expect(wrapper.emitted('search')?.at(-1)).toEqual(['bo', '@'])
  })

  it('disabled 时输入框被禁用', () => {
    const wrapper = mount(KbMentions, { props: { options: OPTIONS, disabled: true } })
    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('kb-mentions--disabled')
  })
})
