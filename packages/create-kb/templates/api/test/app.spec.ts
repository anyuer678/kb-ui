import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import type { Server } from 'node:http'
import { createApp } from '../src/app'

let server: Server
let base: string

beforeAll(async () => {
  const app = createApp()
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve())
  })
  const address = server.address()
  if (address && typeof address === 'object') {
    base = `http://127.0.0.1:${address.port}`
  }
})

afterAll(() => {
  server?.close()
})

describe('API 服务', () => {
  it('GET /health 返回 ok', async () => {
    const res = await request(base).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('GET /items 返回列表', async () => {
    const res = await request(base).get('/items')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('POST /items 校验失败返回 400', async () => {
    const res = await request(base).post('/items').send({ name: '' })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe(400)
  })

  it('POST /items 创建成功', async () => {
    const res = await request(base).post('/items').send({ name: '新任务' })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('新任务')
  })

  it('GET /items/:id 未找到返回 404', async () => {
    const res = await request(base).get('/items/9999')
    expect(res.status).toBe(404)
  })
})
