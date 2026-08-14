import { describe, it, expect } from 'vitest'
import { chatSchema } from '../src/routes/chat'

// 校验层单测（不触发真实模型调用）
describe('chatSchema', () => {
  it('合法消息通过', () => {
    const result = chatSchema.safeParse({
      messages: [{ role: 'user', content: '你好' }],
    })
    expect(result.success).toBe(true)
  })

  it('空消息拒绝', () => {
    const result = chatSchema.safeParse({ messages: [] })
    expect(result.success).toBe(false)
  })

  it('非法角色拒绝', () => {
    const result = chatSchema.safeParse({ messages: [{ role: 'robot', content: 'hi' }] })
    expect(result.success).toBe(false)
  })

  it('temperature 越界拒绝', () => {
    const result = chatSchema.safeParse({ messages: [{ role: 'user', content: 'x' }], temperature: 5 })
    expect(result.success).toBe(false)
  })
})
