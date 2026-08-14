/** 数组分块 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}

/** 数组去重 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/** 按 key 去重 */
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set<unknown>()
  return arr.filter((item) => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/** 洗牌（Fisher-Yates） */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** 按字段分组 */
export function groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(typeof key === 'function' ? key(item) : item[key])
    ;(acc[k] ??= []).push(item)
    return acc
  }, {})
}

/** 取前 n 个 */
export function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, Math.max(0, n))
}

/** 求和 */
export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

/** 平均值 */
export function average(arr: number[]): number {
  if (!arr.length) return 0
  return sum(arr) / arr.length
}

/** 扁平化 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : [item]), [])
}
