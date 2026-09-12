import { retry } from './async'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequestConfig {
  url: string
  method: HttpMethod
  headers: Record<string, string>
  body?: unknown
  /** 超时毫秒数，超时会中止请求 */
  timeout: number
}

export interface HttpResponse<T = unknown> {
  data: T
  status: number
  ok: boolean
  headers: Headers
  config: HttpRequestConfig
}

/** 统一的请求错误：网络错误 status 为 0，HTTP 错误则是真实状态码 */
export class HttpError extends Error {
  readonly status: number
  readonly data: unknown
  readonly config: HttpRequestConfig

  constructor(message: string, options: { status?: number; data?: unknown; config: HttpRequestConfig }) {
    super(message)
    this.name = 'HttpError'
    this.status = options.status ?? 0
    this.data = options.data
    this.config = options.config
  }
}

export interface RequestOptions {
  baseURL?: string
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  /** 覆盖本次请求的重试次数 */
  retries?: number
  signal?: AbortSignal
}

export interface HttpOptions {
  baseURL?: string
  headers?: Record<string, string>
  /** 默认超时，默认 10000ms */
  timeout?: number
  /** 失败重试次数，默认 0（不重试）；只对网络错误与 5xx 生效 */
  retries?: number
  /** 重试退避基数，默认 200ms（指数退避） */
  retryBaseDelay?: number
  onRequest?: (config: HttpRequestConfig) => HttpRequestConfig | void | Promise<HttpRequestConfig | void>
  onResponse?: (response: HttpResponse) => void | Promise<void>
  onError?: (error: HttpError) => void | Promise<void>
  /** 自定义 fetch 实现，方便测试或换到非标准运行时 */
  fetch?: typeof fetch
}

export interface HttpClient {
  <T = unknown>(url: string, config?: RequestOptions & { method?: HttpMethod; body?: unknown }): Promise<T>
  get<T = unknown>(url: string, config?: RequestOptions): Promise<T>
  post<T = unknown>(url: string, body?: unknown, config?: RequestOptions): Promise<T>
  put<T = unknown>(url: string, body?: unknown, config?: RequestOptions): Promise<T>
  patch<T = unknown>(url: string, body?: unknown, config?: RequestOptions): Promise<T>
  delete<T = unknown>(url: string, config?: RequestOptions): Promise<T>
  readonly defaults: Readonly<HttpOptions>
}

const DEFAULT_TIMEOUT = 10_000

function isAbsoluteURL(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function joinURL(base: string | undefined, url: string): string {
  if (!base || isAbsoluteURL(url)) return url
  return `${base.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}

/** 追加查询串，自动跳过 undefined / null / 空字符串 */
export function withQuery(url: string, params?: Record<string, unknown>): string {
  if (!params) return url
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.append(key, String(value))
  }
  const query = search.toString()
  if (!query) return url
  return `${url}${url.includes('?') ? '&' : '?'}${query}`
}

function isRawBody(body: unknown): body is BodyInit {
  if (typeof body === 'string') return true
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) return true
  if (typeof FormData !== 'undefined' && body instanceof FormData) return true
  if (typeof Blob !== 'undefined' && body instanceof Blob) return true
  return false
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) return undefined
  if (isRawBody(body)) return body
  return JSON.stringify(body)
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return null
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('json')) {
    return response.json().catch(() => null)
  }
  return response.text()
}

/** 默认重试策略：网络错误与 5xx 重试，4xx 属于调用方问题，重试没有意义 */
function shouldRetry(error: unknown): boolean {
  if (error instanceof HttpError) return error.status === 0 || error.status >= 500
  return true
}

/**
 * 创建一个带默认配置的请求实例。基于原生 fetch，不引第三方依赖。
 *
 * ```ts
 * const http = createHttp({ baseURL: '/api', retries: 2 })
 * const page = await http.get<PageResult<User>>('/users', { params: { page: 1, pageSize: 20 } })
 * ```
 */
export function createHttp(options: HttpOptions = {}): HttpClient {
  const defaults: HttpOptions = { timeout: DEFAULT_TIMEOUT, retries: 0, ...options }
  const doFetch = defaults.fetch ?? globalThis.fetch

  async function send<T>(
    method: HttpMethod,
    url: string,
    body: unknown,
    config: RequestOptions & { method?: HttpMethod; body?: unknown } = {},
  ): Promise<T> {
    let requestConfig: HttpRequestConfig = {
      url: withQuery(joinURL(config.baseURL ?? defaults.baseURL, url), config.params),
      method: config.method ?? method,
      headers: { ...defaults.headers, ...config.headers },
      body: config.body ?? body,
      timeout: config.timeout ?? defaults.timeout ?? DEFAULT_TIMEOUT,
    }

    if (
      requestConfig.body !== undefined &&
      requestConfig.body !== null &&
      !isRawBody(requestConfig.body) &&
      requestConfig.headers['Content-Type'] === undefined
    ) {
      requestConfig.headers['Content-Type'] = 'application/json'
    }

    const patched = await defaults.onRequest?.(requestConfig)
    if (patched) requestConfig = patched

    if (typeof doFetch !== 'function') {
      throw new HttpError('当前运行时不支持 fetch，请在 HttpOptions 里注入 fetch 实现', {
        config: requestConfig,
      })
    }

    const attempt = async (): Promise<HttpResponse<T>> => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), requestConfig.timeout)
      const onAbort = () => controller.abort()
      config.signal?.addEventListener('abort', onAbort)
      try {
        const response = await doFetch(requestConfig.url, {
          method: requestConfig.method,
          headers: requestConfig.headers,
          body: serializeBody(requestConfig.body),
          signal: controller.signal,
        })
        const data = (await parseBody(response)) as T
        const result: HttpResponse<T> = {
          data,
          status: response.status,
          ok: response.ok,
          headers: response.headers,
          config: requestConfig,
        }
        if (!response.ok) {
          throw new HttpError(`请求失败: ${response.status}`, {
            status: response.status,
            data,
            config: requestConfig,
          })
        }
        await defaults.onResponse?.(result)
        return result
      } catch (error) {
        if (error instanceof HttpError) throw error
        const aborted = controller.signal.aborted
        throw new HttpError(aborted ? `请求超时（${requestConfig.timeout}ms）` : '网络请求失败', {
          status: 0,
          data: error,
          config: requestConfig,
        })
      } finally {
        clearTimeout(timer)
        config.signal?.removeEventListener('abort', onAbort)
      }
    }

    const retries = config.retries ?? defaults.retries ?? 0
    try {
      const response =
        retries > 0
          ? await retry(attempt, {
              times: retries + 1,
              baseDelay: defaults.retryBaseDelay ?? 200,
              shouldRetry,
            })
          : await attempt()
      return response.data
    } catch (error) {
      const httpError =
        error instanceof HttpError ? error : new HttpError('请求失败', { config: requestConfig })
      await defaults.onError?.(httpError)
      throw httpError
    }
  }

  const request = <T>(url: string, config?: RequestOptions & { method?: HttpMethod; body?: unknown }) =>
    send<T>(config?.method ?? 'GET', url, undefined, config)

  return Object.assign(request, {
    get: <T>(url: string, config?: RequestOptions) => send<T>('GET', url, undefined, config),
    post: <T>(url: string, body?: unknown, config?: RequestOptions) =>
      send<T>('POST', url, body, config),
    put: <T>(url: string, body?: unknown, config?: RequestOptions) =>
      send<T>('PUT', url, body, config),
    patch: <T>(url: string, body?: unknown, config?: RequestOptions) =>
      send<T>('PATCH', url, body, config),
    delete: <T>(url: string, config?: RequestOptions) => send<T>('DELETE', url, undefined, config),
    defaults,
  }) as HttpClient
}
