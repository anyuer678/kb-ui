import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import type { Server } from 'node:http'
import { createApp } from '../src/app'
import { OPTIONS_TOTAL } from '../src/data/options'
import { REGION_NODE_COUNT } from '../src/data/regions'
import { USERS_TOTAL } from '../src/data/users'

let server: Server
let base: string

beforeAll(async () => {
  const app = createApp({ name: 'test-api' })
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

describe('健康检查与根路由', () => {
  it('GET /api/health 返回 ok 与服务标识', async () => {
    const res = await request(base).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.name).toBe('test-api')
    expect(typeof res.body.uptime).toBe('number')
  })

  it('GET /health 无前缀同样可用（容器探活）', async () => {
    const res = await request(base).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('GET / 列出可用接口', async () => {
    const res = await request(base).get('/')
    expect(res.status).toBe(200)
    expect(res.body.prefix).toBe('/api')
    expect(res.body.endpoints.length).toBeGreaterThan(0)
  })
})

describe('GET /api/users 分页 / 排序 / 搜索', () => {
  it('默认返回第 1 页 10 条，total 为全量', async () => {
    const res = await request(base).get('/api/users')
    expect(res.status).toBe(200)
    expect(res.body.list).toHaveLength(10)
    expect(res.body.total).toBe(USERS_TOTAL)
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(10)
    expect(res.body.list[0].id).toBe(1)
  })

  it('翻页返回对应片段且不重叠', async () => {
    const first = await request(base).get('/api/users?page=1&pageSize=20')
    const second = await request(base).get('/api/users?page=2&pageSize=20')
    expect(first.body.list).toHaveLength(20)
    expect(second.body.list).toHaveLength(20)
    expect(second.body.list[0].id).toBe(21)
    const overlap = second.body.list.filter((row: { id: number }) =>
      first.body.list.some((item: { id: number }) => item.id === row.id),
    )
    expect(overlap).toHaveLength(0)
  })

  it('pageSize 非法时回退默认值，page 越界返回空列表', async () => {
    const fallback = await request(base).get('/api/users?pageSize=0')
    expect(fallback.body.pageSize).toBe(10)

    const beyond = await request(base).get('/api/users?page=999')
    expect(beyond.body.list).toHaveLength(0)
    expect(beyond.body.total).toBe(USERS_TOTAL)
  })

  it('keyword 模糊匹配姓名 / 公司 / 邮箱', async () => {
    const res = await request(base).get('/api/users?keyword=%E6%98%9F%E5%B0%98')
    // "星尘" 命中星尘科技
    expect(res.body.total).toBeGreaterThan(0)
    for (const row of res.body.list) {
      expect(row.company).toContain('星尘')
    }

    const byEmail = await request(base).get('/api/users?keyword=user12@')
    expect(byEmail.body.list[0].email).toBe('user12@example.com')
  })

  it('sortBy=score&order=desc 正确降序，白名单外字段被忽略', async () => {
    const desc = await request(base).get('/api/users?sortBy=score&order=desc&pageSize=5')
    const scores = desc.body.list.map((row: { score: number }) => row.score)
    expect([...scores].sort((a: number, b: number) => b - a)).toEqual(scores)

    const asc = await request(base).get('/api/users?sortBy=score&order=asc&pageSize=5')
    const ascScores = asc.body.list.map((row: { score: number }) => row.score)
    expect([...ascScores].sort((a: number, b: number) => a - b)).toEqual(ascScores)

    // 不在白名单里 → 保持原始顺序
    const ignored = await request(base).get('/api/users?sortBy=__proto__&order=desc')
    expect(ignored.body.list[0].id).toBe(1)
  })
})

describe('GET /api/regions 树与懒加载', () => {
  it('GET /api/regions/tree 返回完整嵌套树', async () => {
    const res = await request(base).get('/api/regions/tree')
    expect(res.status).toBe(200)
    expect(res.body.total).toBe(REGION_NODE_COUNT)
    expect(res.body.list).toHaveLength(8)
    expect(res.body.list[0].children).toHaveLength(6)
    expect(res.body.list[0].children[0].children).toHaveLength(8)
  })

  it('GET /api/regions 不带 parent 返回顶层', async () => {
    const res = await request(base).get('/api/regions')
    expect(res.body.parent).toBeNull()
    expect(res.body.list).toHaveLength(8)
    expect(res.body.leaf).toBe(false)
  })

  it('GET /api/regions?parent=a1 只返回下一级且不带 children', async () => {
    const res = await request(base).get('/api/regions?parent=a1')
    expect(res.body.list).toHaveLength(6)
    expect(res.body.parent).toBe('a1')
    for (const node of res.body.list) {
      expect(node).not.toHaveProperty('children')
      expect(node.leaf).toBe(false)
    }
  })

  it('末级节点的下一级为空且 leaf 为 true', async () => {
    const res = await request(base).get('/api/regions?parent=a1-c1-b1')
    expect(res.body.list).toHaveLength(0)
    expect(res.body.leaf).toBe(true)
  })

  it('parent 不存在返回 404', async () => {
    const res = await request(base).get('/api/regions?parent=not-exist')
    expect(res.status).toBe(404)
    expect(res.body.code).toBe(404)
  })
})

describe('GET /api/options 搜索与分页', () => {
  it('默认第 1 页 10 条，total 为全量', async () => {
    const res = await request(base).get('/api/options')
    expect(res.body.list).toHaveLength(10)
    expect(res.body.total).toBe(OPTIONS_TOTAL)
  })

  it('pageSize 足够大时一次取回全部', async () => {
    const res = await request(base).get('/api/options?pageSize=500')
    expect(res.body.list).toHaveLength(OPTIONS_TOTAL)
  })

  it('keyword 过滤后 total 是过滤后的条数', async () => {
    const res = await request(base).get('/api/options?keyword=%E5%80%99%E9%80%89%E9%A1%B9%2001')
    expect(res.body.total).toBeLessThan(OPTIONS_TOTAL)
    expect(res.body.total).toBeGreaterThan(0)
  })
})

describe('写操作、校验与错误处理', () => {
  it('POST /api/users 参数不合法返回 400 与字段错误', async () => {
    const res = await request(base).post('/api/users').send({ name: '' })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe(400)
    expect(res.body.errors.name).toBeTruthy()
  })

  it('POST /api/users 创建成功返回 201', async () => {
    const res = await request(base).post('/api/users').send({ name: '新用户', score: 88 })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('新用户')
    expect(res.body.score).toBe(88)
    expect(res.body.id).toBeGreaterThan(USERS_TOTAL)

    const detail = await request(base).get(`/api/users/${res.body.id}`)
    expect(detail.status).toBe(200)
    expect(detail.body.name).toBe('新用户')

    const removed = await request(base).delete(`/api/users/${res.body.id}`)
    expect(removed.status).toBe(204)

    const again = await request(base).delete(`/api/users/${res.body.id}`)
    expect(again.status).toBe(404)
  })

  it('GET /api/users/:id 不存在返回 404 与中文提示', async () => {
    const res = await request(base).get('/api/users/999999')
    expect(res.status).toBe(404)
    expect(res.body.message).toContain('用户不存在')
  })

  it('未知路由返回 404', async () => {
    const res = await request(base).get('/api/not-exist')
    expect(res.status).toBe(404)
    expect(res.body.code).toBe(404)
  })

  it('预检请求返回 204 并带 CORS 头', async () => {
    const res = await request(base)
      .options('/api/users')
      .set('Origin', 'http://localhost:5173')
    expect(res.status).toBe(204)
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })
})
