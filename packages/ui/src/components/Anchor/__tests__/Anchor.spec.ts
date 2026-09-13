import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbAnchor from '../Anchor.vue'
import type { AnchorItem } from '../Anchor.vue'

const ITEMS: AnchorItem[] = [
  {
    title: '第一章',
    href: '#s1',
    children: [{ title: '小节 1.1', href: '#s1-1' }],
  },
  { title: '第二章', href: '#s2' },
  { title: '第三章', href: '#s3' },
]

/** 造一个带固定 getBoundingClientRect 的锚点目标，便于在 jsdom 中模拟滚动位置 */
function rect(top: number): DOMRect {
  return {
    top,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect
}

function createSection(id: string, top: number): HTMLElement {
  const el = document.createElement('div')
  el.id = id
  el.getBoundingClientRect = () => rect(top)
  document.body.appendChild(el)
  return el
}

function moveSection(el: HTMLElement, top: number): void {
  el.getBoundingClientRect = () => rect(top)
}

/** 当前高亮项的文案 */
function activeText(wrapper: ReturnType<typeof mount>): string | undefined {
  const active = wrapper.find('.kb-anchor__item--active .kb-anchor__link')
  return active.exists() ? active.text() : undefined
}

/** 挂在 onMounted 里的高亮计算需要一个 tick 才会反映到 DOM */
async function mountAnchor(props: Record<string, unknown> = {}) {
  const wrapper = mount(KbAnchor, { props: { items: ITEMS, ...props } })
  await nextTick()
  return wrapper
}

describe('KbAnchor', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('渲染一级与子级锚点', async () => {
    createSection('s1', 100)
    createSection('s1-1', 200)
    createSection('s2', 400)
    createSection('s3', 700)
    const wrapper = await mountAnchor()

    const links = wrapper.findAll('.kb-anchor__link')
    expect(links.map((l) => l.text())).toEqual(['第一章', '小节 1.1', '第二章', '第三章'])
    expect(wrapper.find('.kb-anchor__sublist').exists()).toBe(true)
  })

  it('导航带无障碍标注', async () => {
    const wrapper = await mountAnchor()
    expect(wrapper.find('.kb-anchor').attributes('aria-label')).toBe('锚点导航')
  })

  it('挂载后高亮最后一个已滚过顶部的目标', async () => {
    createSection('s1', -200)
    createSection('s1-1', -100)
    createSection('s2', -50)
    createSection('s3', 300)
    const wrapper = await mountAnchor()

    // s1 / s1-1 / s2 都已滚过顶部，按拍平顺序取最后一个
    expect(activeText(wrapper)).toBe('第二章')
    expect(wrapper.emitted('change')![0]).toEqual(['#s2'])
  })

  it('offsetTop 扩大判定范围', async () => {
    createSection('s1', -10)
    createSection('s1-1', 20)
    createSection('s2', 50)
    createSection('s3', 400)
    // 偏移 100 时，顶部 50 的 s2 也已进入判定范围
    const wrapper = await mountAnchor({ offsetTop: 100 })
    expect(activeText(wrapper)).toBe('第二章')
  })

  it('滚动时更新高亮', async () => {
    const s1 = createSection('s1', -300)
    const s1Sub = createSection('s1-1', -200)
    const s2 = createSection('s2', 400)
    createSection('s3', 900)
    const wrapper = await mountAnchor()
    expect(activeText(wrapper)).toBe('小节 1.1')

    // 向下滚动：s2 顶部越过视口顶部
    moveSection(s1, -700)
    moveSection(s1Sub, -600)
    moveSection(s2, -50)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(activeText(wrapper)).toBe('第二章')
    expect(wrapper.emitted('change')!.map((e) => e[0])).toEqual(['#s1-1', '#s2'])
  })

  it('点击锚点滚动到目标位置并派发 change', async () => {
    createSection('s1', 120)
    createSection('s1-1', 260)
    createSection('s2', 600)
    createSection('s3', 900)
    const wrapper = await mountAnchor({ offsetTop: 20 })

    await wrapper.findAll('.kb-anchor__link')[2].trigger('click')

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 580, behavior: 'smooth' })
    expect(activeText(wrapper)).toBe('第二章')
    expect(wrapper.emitted('change')!.at(-1)).toEqual(['#s2'])
  })

  it('smooth=false 时使用即时滚动', async () => {
    createSection('s1', 50)
    createSection('s1-1', 80)
    createSection('s2', 200)
    createSection('s3', 300)
    const wrapper = await mountAnchor({ smooth: false })

    await wrapper.findAll('.kb-anchor__link')[0].trigger('click')
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 50, behavior: 'auto' })
  })

  it('目标不存在时点击不滚动', async () => {
    const wrapper = await mountAnchor({ items: [{ title: '幽灵', href: '#missing' }] })
    await wrapper.find('.kb-anchor__link').trigger('click')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('卸载后移除滚动监听', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = await mountAnchor()
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
