/** localStorage JSON 封装（带过期时间） */
export const storage = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return defaultValue
      const parsed = JSON.parse(raw)
      if (parsed.expire && Date.now() > parsed.expire) {
        localStorage.removeItem(key)
        return defaultValue
      }
      return (parsed.value ?? defaultValue) as T
    } catch {
      return defaultValue
    }
  },
  set<T>(key: string, value: T, ttlMs?: number): void {
    const payload = { value, expire: ttlMs ? Date.now() + ttlMs : undefined }
    localStorage.setItem(key, JSON.stringify(payload))
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  },
}

/** sessionStorage 简写 */
export const session = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const raw = sessionStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string): void {
    sessionStorage.removeItem(key)
  },
}
