import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbTour from '../Tour.vue'
import type { TourStep } from '../Tour.vue'

const stubTeleport = { global: { stubs: { teleport: true } } }

const STEPS: TourStep[] = [
  { title: '第一步', description: '说明一' },
  { title: '第二步', description: '说明二' },
  { title: '第三步' },
]

function mountTour(props: Record<string, unknown> = {}) {
  return mount(KbTour, {
    props: { modelValue: true, steps: STEPS, ...props },
    ...stubTeleport,
  })
}

/** 按文案找到气泡底部按钮 */
function button(wrapper: ReturnType<typeof mountTour>, text: string) {
  return wrapper.findAll('.kb-tour__btn').find((b) => b.text() === text)
}

describe('KbTour', () => {
  it('modelValue=false 时不渲染', () => {
    const wrapper = mountTour({ modelValue: false })
    expect(wrapper.find('.kb-tour').exists()).toBe(false)
  })

  it('渲染首个步骤的标题与描述', () => {
    const wrapper = mountTour()
    expect(wrapper.find('.kb-tour__title').text()).toBe('第一步')
    expect(wrapper.find('.kb-tour__description').text()).toBe('说明一')
  })

  it('展示当前进度', () => {
    const wrapper = mountTour()
    expect(wrapper.find('.kb-tour__progress').text()).toBe('1 / 3')
  })

  it('首个步骤不显示「上一步」', () => {
    const wrapper = mountTour()
    expect(button(wrapper, '上一步')).toBeUndefined()
    expect(button(wrapper, '下一步')).toBeDefined()
  })

  it('点击下一步推进并派发 update:current / change', async () => {
    const wrapper = mountTour()
    await button(wrapper, '下一步')!.trigger('click')

    expect(wrapper.find('.kb-tour__title').text()).toBe('第二步')
    expect(wrapper.emitted('update:current')![0]).toEqual([1])
    expect(wrapper.emitted('change')![0]).toEqual([1])
    expect(button(wrapper, '上一步')).toBeDefined()
  })

  it('点击上一步回退', async () => {
    const wrapper = mountTour({ current: 1 })
    await button(wrapper, '上一步')!.trigger('click')
    expect(wrapper.find('.kb-tour__title').text()).toBe('第一步')
    expect(wrapper.emitted('update:current')![0]).toEqual([0])
  })

  it('最后一步按钮变为结束引导，点击派发 finish 并关闭', async () => {
    const wrapper = mountTour({ current: 2 })
    expect(button(wrapper, '结束引导')).toBeDefined()

    await button(wrapper, '结束引导')!.trigger('click')
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('无描述的步骤不渲染描述节点', () => {
    const wrapper = mountTour({ current: 2 })
    expect(wrapper.find('.kb-tour__description').exists()).toBe(false)
  })

  it('点击跳过关闭引导', async () => {
    const wrapper = mountTour()
    await button(wrapper, '跳过')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('showSkip=false 隐藏跳过按钮', () => {
    const wrapper = mountTour({ showSkip: false })
    expect(button(wrapper, '跳过')).toBeUndefined()
  })

  it('点击遮罩关闭（maskClosable 默认 true）', async () => {
    const wrapper = mountTour()
    await wrapper.find('.kb-tour__mask').trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('maskClosable=false 时点击遮罩不关闭', async () => {
    const wrapper = mountTour({ maskClosable: false })
    await wrapper.find('.kb-tour__mask').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('关闭按钮派发关闭', async () => {
    const wrapper = mountTour()
    await wrapper.find('.kb-tour__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('current 变更同步内部步骤', async () => {
    const wrapper = mountTour()
    await wrapper.setProps({ current: 1 })
    await nextTick()
    expect(wrapper.find('.kb-tour__title').text()).toBe('第二步')
  })

  it('气泡为模态对话框语义', () => {
    const wrapper = mountTour()
    const bubble = wrapper.find('.kb-tour__bubble')
    expect(bubble.attributes('role')).toBe('dialog')
    expect(bubble.attributes('aria-modal')).toBe('true')
  })
})
