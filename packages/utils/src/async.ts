/** 并发限制器：最多同时执行 limit 个任务 */
export function pLimit(limit: number): {
  <T>(fn: () => Promise<T>): Promise<T>
  readonly activeCount: number
  readonly pendingCount: number
} {
  let active = 0
  let pending = 0
  const queue: (() => void)[] = []

  const next = (): void => {
    active--
    queue.shift()?.()
  }

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    pending++
    if (active >= limit) {
      await new Promise<void>((resolve) => queue.push(resolve))
    }
    pending--
    active++
    try {
      return await fn()
    } finally {
      next()
    }
  }
  Object.defineProperty(run, 'activeCount', { get: () => active })
  Object.defineProperty(run, 'pendingCount', { get: () => pending })
  return run as typeof run & { readonly activeCount: number; readonly pendingCount: number }
}

/** 自动重试：fn 失败时按指数退避重试 */
export async function retry<T>(fn: () => Promise<T>, { times = 3, baseDelay = 200 }: { times?: number; baseDelay?: number } = {}): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < times - 1) await new Promise((r) => setTimeout(r, baseDelay * 2 ** i))
    }
  }
  throw lastError
}
