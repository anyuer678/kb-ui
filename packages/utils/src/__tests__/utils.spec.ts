import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, formatFileSize, formatDuration, timeAgo } from '../format'
import { chunk, unique, uniqueBy, shuffle, groupBy, flatten, sum, average } from '../array'
import { pick, omit, deepClone, deepMerge, isEmpty } from '../object'
import { truncate, camelCase, kebabCase, capitalize, maskString, randomString, stripHtml } from '../string'
import { isEmail, isUrl, isPhone, isIdCard } from '../regex'
import { clamp, randomInt, percentToRatio, formatCurrency } from '../math'
import { debounce, throttle, waitFor } from '../time'
import { pLimit, retry } from '../async'

describe('format', () => {
  it('formatDate 模板', () => {
    expect(formatDate(new Date(2026, 7, 15, 9, 5, 3), 'YYYY-MM-DD')).toBe('2026-08-15')
    expect(formatDate('2026-08-15T10:00:00', 'YYYY/MM/DD HH:mm')).toBe('2026/08/15 10:00')
  })

  it('formatNumber 千分位', () => {
    expect(formatNumber(12345.678, 2)).toBe('12,345.68')
  })

  it('formatFileSize', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })

  it('formatDuration', () => {
    expect(formatDuration(90061)).toBe('1天1小时1分1秒')
    expect(formatDuration(30)).toBe('30秒')
  })

  it('timeAgo', () => {
    expect(timeAgo(new Date(Date.now() - 5000))).toBe('刚刚')
    expect(timeAgo(new Date(Date.now() - 5 * 60000))).toBe('5分钟前')
  })
})

describe('array', () => {
  it('chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('unique / uniqueBy', () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3])
    expect(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], 'id')).toHaveLength(2)
  })

  it('shuffle 保序性', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr).sort()).toEqual(arr)
  })

  it('groupBy', () => {
    const result = groupBy([{ t: 'a', v: 1 }, { t: 'b', v: 2 }, { t: 'a', v: 3 }], 't')
    expect(result.a).toHaveLength(2)
    expect(result.b).toHaveLength(1)
  })

  it('flatten / sum / average', () => {
    expect(flatten([1, [2, [3]]])).toEqual([1, 2, 3])
    expect(sum([1, 2, 3])).toBe(6)
    expect(average([1, 2, 3])).toBe(2)
  })
})

describe('object', () => {
  it('pick / omit', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    expect(omit({ a: 1, b: 2 }, ['b'])).toEqual({ a: 1 })
  })

  it('deepClone 隔离', () => {
    const src = { a: { b: [1, 2] } }
    const clone = deepClone(src)
    clone.a.b.push(3)
    expect(src.a.b).toHaveLength(2)
  })

  it('deepMerge', () => {
    expect(deepMerge({ a: { x: 1 } }, { a: { y: 2 }, b: 3 })).toEqual({ a: { x: 1, y: 2 }, b: 3 })
  })

  it('isEmpty', () => {
    expect(isEmpty({})).toBe(true)
    expect(isEmpty({ a: 1 })).toBe(false)
  })
})

describe('string', () => {
  it('truncate', () => {
    expect(truncate('这是一个很长的字符串', 6)).toBe('这是一个很长…')
  })

  it('case 转换', () => {
    expect(camelCase('hello-world')).toBe('helloWorld')
    expect(kebabCase('helloWorld')).toBe('hello-world')
    expect(capitalize('hello')).toBe('Hello')
  })

  it('maskString / randomString / stripHtml', () => {
    expect(maskString('13800138000')).toBe('138****8000')
    expect(randomString(16)).toHaveLength(16)
    expect(stripHtml('<b>hi</b>')).toBe('hi')
  })
})

describe('regex', () => {
  it('isEmail / isUrl / isPhone / isIdCard', () => {
    expect(isEmail('a@b.com')).toBe(true)
    expect(isEmail('bad')).toBe(false)
    expect(isUrl('https://example.com/x?y=1')).toBe(true)
    expect(isPhone('13800138000')).toBe(true)
    expect(isPhone('12345')).toBe(false)
    expect(isIdCard('110101199001011234')).toBe(true)
  })
})

describe('math', () => {
  it('clamp / randomInt / percentToRatio / formatCurrency', () => {
    expect(clamp(150, 0, 100)).toBe(100)
    expect(clamp(-5, 0, 100)).toBe(0)
    const r = randomInt(1, 10)
    expect(r).toBeGreaterThanOrEqual(1)
    expect(r).toBeLessThanOrEqual(10)
    expect(percentToRatio(45)).toBe(0.45)
    expect(formatCurrency(12345.6)).toBe('¥12,345.60')
  })
})

describe('time / async', () => {
  it('debounce 只触发一次', async () => {
    let count = 0
    const fn = debounce(() => count++, 30)
    fn()
    fn()
    fn()
    await new Promise((r) => setTimeout(r, 80))
    expect(count).toBe(1)
  })

  it('throttle 限制频率', async () => {
    let count = 0
    const fn = throttle(() => count++, 40)
    fn()
    await new Promise((r) => setTimeout(r, 20))
    fn()
    await new Promise((r) => setTimeout(r, 30))
    fn()
    expect(count).toBe(2)
  })

  it('waitFor 等待条件', async () => {
    let flag = false
    setTimeout(() => (flag = true), 50)
    await waitFor(() => flag, { timeout: 1000 })
    expect(flag).toBe(true)
  })

  it('pLimit 限制并发', async () => {
    const limit = pLimit(2)
    let concurrent = 0
    let max = 0
    const tasks = Array.from({ length: 5 }, () =>
      limit(async () => {
        concurrent++
        max = Math.max(max, concurrent)
        await new Promise((r) => setTimeout(r, 10))
        concurrent--
      }),
    )
    await Promise.all(tasks)
    expect(max).toBeLessThanOrEqual(2)
  })

  it('retry 失败重试成功', async () => {
    let tries = 0
    const result = await retry(async () => {
      tries++
      if (tries < 3) throw new Error('boom')
      return 'ok'
    }, { times: 3, baseDelay: 1 })
    expect(result).toBe('ok')
    expect(tries).toBe(3)
  })
})
