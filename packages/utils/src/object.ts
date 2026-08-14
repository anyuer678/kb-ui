/** 选取指定字段 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const k of keys) if (k in obj) result[k] = obj[k]
  return result
}

/** 排除指定字段 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  for (const k of keys) delete result[k]
  return result
}

/** 深拷贝（结构化克隆，支持 Date/Map/Set/RegExp） */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

/** 深合并（后覆盖前，返回新对象） */
export function deepMerge<T extends Record<string, unknown>>(...objs: T[]): T {
  const isObj = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object' && !Array.isArray(v)
  const merge = (a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = { ...a }
    for (const [k, v] of Object.entries(b)) {
      result[k] = isObj(v) && isObj(result[k]) ? merge(result[k] as Record<string, unknown>, v) : v
    }
    return result
  }
  return objs.reduce<Record<string, unknown>>((acc, obj) => merge(acc, obj), {}) as T
}

/** 是否空对象 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0
}
