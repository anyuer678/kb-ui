export type SortOrder = 'asc' | 'desc'

export interface PageQuery {
  page: number
  pageSize: number
  keyword: string
  sortBy: string | null
  order: SortOrder
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ListQueryOptions {
  /** 参与 keyword 模糊匹配的字段 */
  searchFields?: readonly string[]
  /** 允许排序的字段白名单，未列出的字段会被忽略（避免任意字段排序） */
  sortKeys?: readonly string[]
}

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 500

function toPositiveInt(value: unknown, fallback: number): number {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  const int = Math.floor(num)
  return int > 0 ? int : fallback
}

function readField(row: unknown, field: string): unknown {
  return (row as Record<string, unknown>)[field]
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0
  if (a === null || a === undefined) return -1
  if (b === null || b === undefined) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'zh-Hans-CN')
}

/** 解析 ?page=&pageSize=&keyword=&sortBy=&order=，非法值一律回退到默认值 */
export function parsePageQuery(query: Record<string, unknown> = {}): PageQuery {
  return {
    page: toPositiveInt(query.page, 1),
    pageSize: Math.min(toPositiveInt(query.pageSize, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
    keyword: typeof query.keyword === 'string' ? query.keyword.trim() : '',
    sortBy: typeof query.sortBy === 'string' && query.sortBy ? query.sortBy : null,
    order: query.order === 'desc' ? 'desc' : 'asc',
  }
}

export function searchRows<T>(
  rows: readonly T[],
  keyword: string,
  fields: readonly string[],
): T[] {
  if (!keyword) return [...rows]
  const needle = keyword.toLowerCase()
  return rows.filter((row) =>
    fields.some((field) => String(readField(row, field) ?? '').toLowerCase().includes(needle)),
  )
}

export function sortRows<T>(
  rows: readonly T[],
  sortBy: string | null,
  order: SortOrder,
  allowedKeys?: readonly string[],
): T[] {
  if (!sortBy) return [...rows]
  if (allowedKeys && !allowedKeys.includes(sortBy)) return [...rows]
  const factor = order === 'desc' ? -1 : 1
  return [...rows].sort((a, b) => compareValues(readField(a, sortBy), readField(b, sortBy)) * factor)
}

export function toPageResult<T>(rows: readonly T[], query: PageQuery): PageResult<T> {
  const start = (query.page - 1) * query.pageSize
  return {
    list: rows.slice(start, start + query.pageSize),
    total: rows.length,
    page: query.page,
    pageSize: query.pageSize,
  }
}

/** 搜索 → 排序 → 分页 的标准流水线，列表接口都用它，保证行为一致 */
export function queryList<T>(
  source: readonly T[],
  query: PageQuery,
  options: ListQueryOptions = {},
): PageResult<T> {
  const searched = options.searchFields
    ? searchRows(source, query.keyword, options.searchFields)
    : [...source]
  const sorted = sortRows(searched, query.sortBy, query.order, options.sortKeys)
  return toPageResult(sorted, query)
}
