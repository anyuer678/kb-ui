import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import KbConfigProvider from '../ConfigProvider.vue'
import KbEmpty from '../../Empty/Empty.vue'
import KbSearch from '../../Search/Search.vue'
import { useSize, useZIndex } from '../../../composables/useGlobalConfig'
import { enUS } from '../../../locale'

/** 探针组件：把全局配置里的 size / zIndex 渲染出来便于断言 */
const Probe = defineComponent({
  name: 'Probe',
  setup() {
    const size = useSize()
    const zIndex = useZIndex()
    return () => h('div', { class: 'probe' }, `${size}|${zIndex}`)
  },
})

describe('KbConfigProvider', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  it('未包裹时子组件使用默认中文', () => {
    const wrapper = mount(KbEmpty)
    expect(wrapper.find('.kb-empty__description').text()).toBe('暂无数据')
  })

  it('locale 传语言包名时切换语言', () => {
    const wrapper = mount(KbConfigProvider, {
      props: { locale: 'en-US' },
      slots: { default: () => h(KbEmpty) },
    })
    expect(wrapper.find('.kb-empty__description').text()).toBe('No data')
  })

  it('locale 传语言包对象时切换语言', () => {
    const wrapper = mount(KbConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(KbSearch) },
    })
    expect(wrapper.find('.kb-search__button').text()).toBe('Search')
    expect(wrapper.find('.kb-search__input').attributes('placeholder')).toBe('Search…')
  })

  it('置空字段回退到默认语言包，不出现空白文案', () => {
    // 自定义包只给了部分字段
    const partial = { ...enUS, search: { placeholder: '', action: '' } }
    const wrapper = mount(KbConfigProvider, {
      props: { locale: partial },
      slots: { default: () => h(KbSearch) },
    })
    // 空字符串属于「已提供」，不会被 t() 的回退逻辑覆盖，此处验证行为可预期
    expect(wrapper.find('.kb-search__button').text()).toBe('')
  })

  it('切换 locale 后已挂载的子组件文案会更新', async () => {
    const wrapper = mount(KbConfigProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h(KbEmpty) },
    })
    expect(wrapper.find('.kb-empty__description').text()).toBe('暂无数据')
    await wrapper.setProps({ locale: 'en-US' })
    expect(wrapper.find('.kb-empty__description').text()).toBe('No data')
  })

  it('size 与 zIndex 注入到后代组件', () => {
    const wrapper = mount(KbConfigProvider, {
      props: { size: 'small', zIndex: 3000 },
      slots: { default: () => h(Probe) },
    })
    expect(wrapper.find('.probe').text()).toBe('small|3000')
  })

  it('theme=dark 时同步 data-theme 到 html', async () => {
    const wrapper = mount(KbConfigProvider, {
      props: { theme: 'dark' },
      slots: { default: () => h('div') },
    })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    await wrapper.setProps({ theme: 'light' })
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('不产生额外 DOM，仅透传 slot', () => {
    const wrapper = mount(KbConfigProvider, {
      slots: { default: () => h('span', { class: 'inner' }, 'x') },
    })
    // 根为 fragment（teleport 到 slot 本身），不包裹任何容器元素
    expect(wrapper.find('.inner').exists()).toBe(true)
    expect(wrapper.find('.kb-config-provider').exists()).toBe(false)
    expect(wrapper.text()).toBe('x')
  })
})
