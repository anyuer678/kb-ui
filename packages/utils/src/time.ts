/** 防抖 */
export function debounce<T extends (...args: never[]) => void>(fn: T, wait = 200): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

/** 节流（leading 首触发） */
export function throttle<T extends (...args: never[]) => void>(fn: T, wait = 200): (...args: Parameters<T>) => void {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn(...args)
    }
  }
}

/** 延迟 sleep */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 轮询等待条件成立（超时报错） */
export async function waitFor(condition: () => boolean | Promise<boolean>, { timeout = 5000, interval = 100 } = {}): Promise<void> {
  const start = Date.now()
  while (!(await condition())) {
    if (Date.now() - start > timeout) throw new Error('waitFor timeout')
    await sleep(interval)
  }
}
