import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbImage from '../Image.vue'

const stubTeleport = { global: { stubs: { teleport: true } } }

describe('KbImage', () => {
  it('渲染 img 并透传 src / alt', () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png', alt: '示例图' }, ...stubTeleport })
    const img = wrapper.find('.kb-image__inner')
    expect(img.attributes('src')).toBe('/a.png')
    expect(img.attributes('alt')).toBe('示例图')
  })

  it('数字宽高转换为 px', () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png', width: 120, height: 80 }, ...stubTeleport })
    const style = wrapper.find('.kb-image').attributes('style') ?? ''
    expect(style).toContain('width: 120px')
    expect(style).toContain('height: 80px')
  })

  it('字符串宽高按原样使用', () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png', width: '100%' }, ...stubTeleport })
    expect(wrapper.find('.kb-image').attributes('style')).toContain('width: 100%')
  })

  it('fit 写入 object-fit', () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png', fit: 'cover' }, ...stubTeleport })
    expect(wrapper.find('.kb-image__inner').attributes('style')).toContain('object-fit: cover')
  })

  it('默认渲染预览遮罩', () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png' }, ...stubTeleport })
    expect(wrapper.find('.kb-image__mask').exists()).toBe(true)
    expect(wrapper.find('.kb-image__mask').text()).toBe('预览图片')
  })

  it('preview=false 时不渲染遮罩与预览组件', () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png', preview: false }, ...stubTeleport })
    expect(wrapper.find('.kb-image__mask').exists()).toBe(false)
    expect(wrapper.find('.kb-image-preview').exists()).toBe(false)
  })

  it('加载失败时切换到 fallback 并给出错误提示', async () => {
    const wrapper = mount(KbImage, { props: { src: '/bad.png', fallback: '/fb.png' }, ...stubTeleport })
    await wrapper.find('.kb-image__inner').trigger('error')

    expect(wrapper.find('.kb-image__inner').attributes('src')).toBe('/fb.png')
    expect(wrapper.find('.kb-image__error').exists()).toBe(true)
    expect(wrapper.find('.kb-image__error').text()).toBe('加载失败')
    // 失败后不再显示预览遮罩
    expect(wrapper.find('.kb-image__mask').exists()).toBe(false)
  })

  it('加载失败且无 fallback 时保留原 src', async () => {
    const wrapper = mount(KbImage, { props: { src: '/bad.png' }, ...stubTeleport })
    await wrapper.find('.kb-image__inner').trigger('error')
    expect(wrapper.find('.kb-image__inner').attributes('src')).toBe('/bad.png')
  })

  it('点击遮罩打开预览', async () => {
    const wrapper = mount(KbImage, { props: { src: '/a.png' }, ...stubTeleport })
    expect(wrapper.find('.kb-image-preview').exists()).toBe(false)
    await wrapper.find('.kb-image__mask').trigger('click')
    expect(wrapper.find('.kb-image-preview').exists()).toBe(true)
  })

  it('previewList 决定预览张数', async () => {
    const wrapper = mount(KbImage, {
      props: { src: '/b.png', previewList: ['/a.png', '/b.png', '/c.png'] },
      ...stubTeleport,
    })
    await wrapper.find('.kb-image__mask').trigger('click')
    // 多图时展示计数，且定位到 src 所在的那一张
    expect(wrapper.find('.kb-image-preview__counter').text()).toBe('2 / 3')
  })

  it('加载失败后点击不再打开预览', async () => {
    const wrapper = mount(KbImage, { props: { src: '/bad.png' }, ...stubTeleport })
    await wrapper.find('.kb-image__inner').trigger('error')
    await wrapper.find('.kb-image__inner').trigger('click')
    expect(wrapper.find('.kb-image-preview').exists()).toBe(false)
  })
})
