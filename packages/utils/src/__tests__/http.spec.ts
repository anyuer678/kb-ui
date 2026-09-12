import { describe, it, expect, vi } from 'vitest'
import { createHttp, HttpError, withQuery } from '../http'
import type { HttpRequestConfig } from '../http'

/** 造一个返回指定状态与 JSON 的 Response */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('withQuery', () => {
  it('跳过 undefined / null / 空字符串', () => {
    expect(withQuery('/users', { page: 1, keyword: '', size: undefined, tag: null })).toBe(
      '/users?page=1',
    )
  })

  it('已有查询串时用 & 拼接', () => {
    expect(withQuery('/users?role=admin', { page: 2 })).toBe('/users?role=admin&page=2')
  })

  it('无有效参数时原样返回', () => {
    expect(withQuery('/users', { a: undefined })).toBe('/users')
    expect(withQuery('/users')).toBe('/users')
  })
})

describe('createHttp - 基本请求', () => {
  it('GET 拼接 baseURL 与 params 并解析 JSON', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: true }))
    const http = createHttp({ baseURL: '/api', fetch: fetchMock as unknown as typeof fetch })

    const data = await http.get<{ ok: boolean }>('/users', { params: { page: 1, size: 20 } })

    expect(data).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/api/users?page=1&size=20')
    expect(init.method).toBe('GET')
  })

  it('POST 序列化 body 并补 Content-Type', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ id: 1 }, 201))
    const http = createHttp({ fetch: fetchMock as unknown as typeof fetch })

    await http.post('/users', { name: 'Ann' })

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ name: 'Ann' }))
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('204 无内容返回 null', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }))
    const http = createHttp({ fetch: fetchMock as unknown as typeof fetch })
    await expect(http.delete('/users/1')).resolves.toBeNull()
  })

  it('绝对 URL 覆盖 baseURL', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}))
    const http = createHttp({ baseURL: '/api', fetch: fetchMock as unknown as typeof fetch })
    await http.get('https://example.com/x')
    const [url] = fetchMock.mock.calls[0] as unknown as [string]
    expect(url).toBe('https://example.com/x')
  })
})

describe('createHttp - 错误处理', () => {
  it('4xx 抛 HttpError，带 status 与响应体', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ message: '不存在' }, 404))
    const http = createHttp({ fetch: fetchMock as unknown as typeof fetch })

    await expect(http.get('/users/999')).rejects.toMatchObject({
      name: 'HttpError',
      status: 404,
      data: { message: '不存在' },
    })
  })

  it('网络异常归为 status 0', async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError('failed to fetch')
    })
    const http = createHttp({ fetch: fetchMock as unknown as typeof fetch })

    const error = await http.get('/users').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(HttpError)
    expect((error as HttpError).status).toBe(0)
  })

  it('超时中止并归为 status 0', async () => {
    const fetchMock = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
        }),
    )
    const http = createHttp({
      timeout: 10,
      fetch: fetchMock as unknown as typeof fetch,
    })

    const error = await http.get('/slow').catch((e: unknown) => e)
    expect((error as HttpError).status).toBe(0)
    expect((error as HttpError).message).toContain('超时')
  })

  it('onError 钩子收到 HttpError', async () => {
    const onError = vi.fn()
    const fetchMock = vi.fn(async () => jsonResponse({}, 500))
    const http = createHttp({ fetch: fetchMock as unknown as typeof fetch, onError })

    await http.get('/boom').catch(() => undefined)
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(HttpError)
  })
})

describe('createHttp - 钩子', () => {
  it('onRequest 可改写配置，onResponse 可观察结果', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: true }))
    const onRequest = vi.fn((config: HttpRequestConfig) => {
      config.headers.Authorization = 'Bearer token'
      return config
    })
    const onResponse = vi.fn()
    const http = createHttp({
      fetch: fetchMock as unknown as typeof fetch,
      onRequest,
      onResponse,
    })

    await http.get('/me')

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer token')
    expect(onResponse).toHaveBeenCalledTimes(1)
  })
})

describe('createHttp - 重试', () => {
  it('5xx 按次数重试，最终成功', async () => {
    let calls = 0
    const fetchMock = vi.fn(async () => {
      calls++
      return calls < 3 ? jsonResponse({}, 503) : jsonResponse({ ok: true })
    })
    const http = createHttp({
      retries: 3,
      retryBaseDelay: 1,
      fetch: fetchMock as unknown as typeof fetch,
    })

    await expect(http.get('/flaky')).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('4xx 不重试（只请求一次）', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}, 400))
    const http = createHttp({
      retries: 3,
      retryBaseDelay: 1,
      fetch: fetchMock as unknown as typeof fetch,
    })

    await http.get('/bad').catch(() => undefined)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('每次请求可用 retries 覆盖默认值', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}, 500))
    const http = createHttp({
      retries: 0,
      retryBaseDelay: 1,
      fetch: fetchMock as unknown as typeof fetch,
    })

    await http.get('/x', { retries: 2 }).catch(() => undefined)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
