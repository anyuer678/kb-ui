import { describe, it, expect, vi, afterEach } from 'vitest'
import message from '../index'

describe('message', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('success 创建消息节点', () => {
    message.success('操作成功')
    const el = document.querySelector('.kb-message')
    expect(el).toBeTruthy()
    expect(el!.textContent).toContain('操作成功')
  })

  it('error 应用对应类型 class', () => {
    message.error('出错了')
    const el = document.querySelector('.kb-message')
    expect(el!.className).toContain('kb-message--error')
  })

  it('duration 后自动关闭', () => {
    vi.useFakeTimers()
    const unmount = message.info('通知', 1000)
    expect(document.querySelector('.kb-message')).toBeTruthy()
    unmount()
    expect(document.querySelector('.kb-message')).toBeNull()
    vi.useRealTimers()
  })

  it('多次调用互不影响', () => {
    message.success('a')
    message.warning('b')
    expect(document.querySelectorAll('.kb-message')).toHaveLength(2)
  })
})
