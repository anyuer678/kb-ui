import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KbImagePreview from '../ImagePreview.vue'

const stubTeleport = { global: { stubs: { teleport: true } } }
const IMAGES = ['/a.png', '/b.png', '/c.png']

function mountPreview(props: Record<string, unknown> = {}) {
  return mount(KbImagePreview, {
    props: { visible: true, images: IMAGES, ...props },
    ...stubTeleport,
  })
}

/** 键盘事件挂在 document 上，需直接派发 */
function pressKey(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key }))
}

describe('KbImagePreview', () => {
  it('visible=false 时不渲染', () => {
    const wrapper = mountPreview({ visible: false })
    expect(wrapper.find('.kb-image-preview').exists()).toBe(false)
  })

  it('visible=true 渲染当前图与计数', () => {
    const wrapper = mountPreview({ index: 1 })
    expect(wrapper.find('.kb-image-preview__image').attributes('src')).toBe('/b.png')
    expect(wrapper.find('.kb-image-preview__counter').text()).toBe('2 / 3')
  })

  it('单图时隐藏左右切换按钮与计数', () => {
    const wrapper = mountPreview({ images: ['/only.png'] })
    expect(wrapper.find('.kb-image-preview__nav--prev').exists()).toBe(false)
    expect(wrapper.find('.kb-image-preview__nav--next').exists()).toBe(false)
    expect(wrapper.find('.kb-image-preview__counter').exists()).toBe(false)
  })

  it('点击下一张循环切换并派发事件', async () => {
    const wrapper = mountPreview({ index: 2 })
    await wrapper.find('.kb-image-preview__nav--next').trigger('click')
    // 3 张时从最后一张循环回第一张
    expect(wrapper.find('.kb-image-preview__image').attributes('src')).toBe('/a.png')
    expect(wrapper.emitted('update:index')![0]).toEqual([0])
    expect(wrapper.emitted('change')![0]).toEqual([0])
  })

  it('点击上一张从第一张回绕到最后一张', async () => {
    const wrapper = mountPreview({ index: 0 })
    await wrapper.find('.kb-image-preview__nav--prev').trigger('click')
    expect(wrapper.find('.kb-image-preview__image').attributes('src')).toBe('/c.png')
  })

  it('关闭按钮派发 update:visible=false 与 close', async () => {
    const wrapper = mountPreview()
    await wrapper.find('.kb-image-preview__close').trigger('click')
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击遮罩关闭，点击图片本体不关闭', async () => {
    const wrapper = mountPreview()
    await wrapper.find('.kb-image-preview__image').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.find('.kb-image-preview').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Esc 关闭、方向键切换', async () => {
    const wrapper = mountPreview({ index: 0 })
    pressKey('ArrowRight')
    await nextTick()
    expect(wrapper.emitted('change')![0]).toEqual([1])

    pressKey('ArrowLeft')
    await nextTick()
    expect(wrapper.emitted('change')![1]).toEqual([0])

    pressKey('Escape')
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('缩放按钮改变 transform 且被限制在 0.25 ~ 5 之间', async () => {
    const wrapper = mountPreview()
    const image = () => wrapper.find('.kb-image-preview__image')

    await wrapper.find('[aria-label="放大"]').trigger('click')
    expect(image().attributes('style')).toContain('scale(1.25)')

    for (let i = 0; i < 30; i += 1) {
      await wrapper.find('[aria-label="放大"]').trigger('click')
    }
    expect(image().attributes('style')).toContain('scale(5)')

    for (let i = 0; i < 30; i += 1) {
      await wrapper.find('[aria-label="缩小"]').trigger('click')
    }
    expect(image().attributes('style')).toContain('scale(0.25)')
  })

  it('旋转按钮每次 +90 度', async () => {
    const wrapper = mountPreview()
    await wrapper.find('[aria-label="旋转"]').trigger('click')
    await wrapper.find('[aria-label="旋转"]').trigger('click')
    expect(wrapper.find('.kb-image-preview__image').attributes('style')).toContain('rotate(180deg)')
  })

  it('滚轮缩放', async () => {
    const wrapper = mountPreview()
    await wrapper.find('.kb-image-preview').trigger('wheel', { deltaY: -100 })
    expect(wrapper.find('.kb-image-preview__image').attributes('style')).toContain('scale(1.15)')
  })

  it('重新打开时重置缩放与旋转', async () => {
    const wrapper = mountPreview()
    await wrapper.find('[aria-label="放大"]').trigger('click')
    await wrapper.find('[aria-label="旋转"]').trigger('click')

    await wrapper.setProps({ visible: false })
    await wrapper.setProps({ visible: true })
    const style = wrapper.find('.kb-image-preview__image').attributes('style') ?? ''
    expect(style).toContain('scale(1)')
    expect(style).toContain('rotate(0deg)')
  })

  it('关闭后移除 document 键盘监听', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const wrapper = mountPreview()
    await wrapper.setProps({ visible: false })
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeSpy.mockRestore()
  })
})
