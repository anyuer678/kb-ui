import { describe, it, expect } from 'vitest'
import { createTranslate, defaultLocale, enUS, getLocale, locales, zhCN } from '..'

/** 递归收集对象的全部叶子路径，用于比对两个语言包结构是否一致 */
function leafPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix]
  if (Array.isArray(value)) return [prefix]
  return Object.entries(value as Record<string, unknown>).flatMap(([key, v]) =>
    leafPaths(v, prefix ? `${prefix}.${key}` : key),
  )
}

describe('locale 语言包', () => {
  it('内置 zh-CN 与 en-US 两个包', () => {
    expect(Object.keys(locales)).toEqual(['zh-CN', 'en-US'])
  })

  it('英文包与中文包的 key 结构完全一致', () => {
    const zh = leafPaths(zhCN).sort()
    const en = leafPaths(enUS).sort()
    expect(en).toEqual(zh)
  })

  it('每个叶子都是非空字符串，或长度固定的字符串数组（星期 7 项 / 面板标题 2 项）', () => {
    for (const pack of [zhCN, enUS]) {
      for (const path of leafPaths(pack)) {
        const value = path
          .split('.')
          .reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], pack)
        if (Array.isArray(value)) {
          expect([2, 7], `${pack.name}.${path}`).toContain(value.length)
          expect(
            value.every((v) => typeof v === 'string' && v),
            `${pack.name}.${path}`,
          ).toBe(true)
        } else {
          expect(typeof value, `${pack.name}.${path}`).toBe('string')
          expect(String(value).length, `${pack.name}.${path}`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('含 %s 的文案在英文包里也保留了占位符', () => {
    const t = createTranslate(enUS)
    expect(t('calendar.title', 2026, 3)).toBe('2026/3')
    expect(t('pagination.total', 42)).toContain('42')
    expect(t('cascader.level', 2)).toContain('2')
    expect(t('upload.uploading', 30)).toContain('30')
  })

  it('getLocale 按名称取包，未知名称回退默认包', () => {
    expect(getLocale('en-US')).toBe(enUS)
    expect(getLocale('zh-CN')).toBe(zhCN)
    expect(getLocale('ja-JP')).toBe(defaultLocale)
    expect(getLocale()).toBe(defaultLocale)
    expect(defaultLocale).toBe(zhCN)
  })

  it('t() 按点号路径取文案', () => {
    const t = createTranslate(zhCN)
    expect(t('empty.description')).toBe('暂无数据')
    expect(t('popconfirm.confirmText')).toBe('确定')
    expect(t('transfer.prevPage')).toBe('上一页')
  })

  it('缺失字段回退到默认语言包', () => {
    // 模拟第三方自定义包只覆盖了部分字段
    const partial = { name: 'custom', empty: { description: '空空如也' } } as typeof zhCN
    const t = createTranslate(partial)
    expect(t('empty.description')).toBe('空空如也')
    expect(t('popconfirm.confirmText')).toBe(zhCN.popconfirm.confirmText)
  })

  it('路径完全不存在时原样返回路径，便于开发期定位', () => {
    const t = createTranslate(zhCN) as (p: string, ...args: unknown[]) => string
    expect(t('not.exists')).toBe('not.exists')
  })
})
