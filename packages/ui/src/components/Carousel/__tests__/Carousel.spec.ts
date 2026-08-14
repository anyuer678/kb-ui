import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KbCarousel from '../Carousel.vue'

const items = [{ title: '一' }, { title: '二' }, { title: '三' }]

describe('KbCarousel', () => {
  it('渲染所有面板', () => {
    const wrapper = mount(KbCarousel, { props: { items } })
    expect(wrapper.findAll('.kb-carousel__item')).toHaveLength(3)
  })

  it('默认显示第一项', () => {
    const wrapper = mount(KbCarousel, { props: { items } })
    expect(wrapper.findAll('.kb-carousel__item')[0].classes()).toContain('kb-carousel__item--active')
  })

  it('点击指示器切换', async () => {
    const wrapper = mount(KbCarousel, { props: { items } })
    await wrapper.findAll('.kb-carousel__dot')[2].trigger('click')
    expect(wrapper.findAll('.kb-carousel__item')[2].classes()).toContain('kb-carousel__item--active')
  })

  it('next 切换', async () => {
    const wrapper = mount(KbCarousel, { props: { items } })
    await wrapper.find('.kb-carousel__next').trigger('click')
    expect(wrapper.findAll('.kb-carousel__item')[1].classes()).toContain('kb-carousel__item--active')
  })
})
