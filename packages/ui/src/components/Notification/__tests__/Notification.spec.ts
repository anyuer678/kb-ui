import { describe, it, expect } from 'vitest'
import notification from '../index'

describe('notification', () => {
  it('创建通知节点', () => {
    notification.success({ title: '成功', message: '操作完成' })
    const el = document.querySelector('.kb-notification')
    expect(el).toBeTruthy()
    expect(el!.textContent).toContain('成功')
    expect(el!.textContent).toContain('操作完成')
    document.body.innerHTML = ''
  })

  it('error 应用对应类型 class', () => {
    notification.error({ title: '错误', message: '出错了' })
    expect(document.querySelector('.kb-notification')!.className).toContain('kb-notification--error')
    document.body.innerHTML = ''
  })

  it('duration 0 不自动关闭', () => {
    const unmount = notification.info({ title: '提示', message: 'x', duration: 0 })
    expect(document.querySelector('.kb-notification')).toBeTruthy()
    unmount()
    expect(document.querySelector('.kb-notification')).toBeNull()
    document.body.innerHTML = ''
  })
})
