import { createHttp } from '@kb/utils'
import type { OptionItem, PageResult, RegionNode, RegionSummary, User } from '@kb/api'

/**
 * 演示用的请求客户端：开发态由 Vite 代理 `/api` 到 `@kb/api`（默认 127.0.0.1:8082）。
 * 不需要真后端时，页面会落到 catch 分支展示错误提示，不影响其它组件演示。
 *
 * 接口的**类型**直接复用 `@kb/api` 的导出（`import type`，不进运行时代码），
 * 这样前端与后端的契约只有一份定义，改后端就能被 vue-tsc 立刻发现。
 */
export const http = createHttp({
  baseURL: '/api',
  timeout: 8000,
  retries: 1,
  retryBaseDelay: 300,
})

export type { OptionItem, PageResult, RegionNode, RegionSummary }

/** 与 `@kb/api` 的 `User` 同构，这里只换个更贴合前端的名字 */
export type ApiUser = User

/** `/api/users` 的查询入参（可选形态，与后端归一化后的 `PageQuery` 区分） */
export interface UserQuery {
  page?: number
  pageSize?: number
  keyword?: string
  sortBy?: string | null
  order?: 'asc' | 'desc'
}

/** GET /api/users —— 服务端分页 + 排序 + 搜索 */
export function fetchUsers(query: UserQuery = {}): Promise<PageResult<ApiUser>> {
  return http.get<PageResult<ApiUser>>('/users', {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword,
      sortBy: query.sortBy ?? undefined,
      order: query.order,
    },
  })
}

/** `GET /api/regions?parent=` 的响应（该组合形状由路由拼装，包里未单独导出） */
export interface RegionChildren {
  parent: string | null
  list: RegionSummary[]
  leaf: boolean
}

/** GET /api/regions?parent= —— 只取下一级，供 Cascader 懒加载 */
export function fetchRegions(parent?: string | null): Promise<RegionChildren> {
  return http.get<RegionChildren>('/regions', { params: { parent: parent ?? undefined } })
}

/** GET /api/regions/tree —— 完整树（440 节点），供 Tree 虚拟滚动 */
export function fetchRegionTree(): Promise<{ list: RegionNode[]; total: number }> {
  return http.get<{ list: RegionNode[]; total: number }>('/regions/tree')
}

/** GET /api/options —— 候选项分页 + 搜索，供 Transfer 取数 */
export function fetchOptions(query: UserQuery = {}): Promise<PageResult<OptionItem>> {
  return http.get<PageResult<OptionItem>>('/options', {
    params: { page: query.page, pageSize: query.pageSize, keyword: query.keyword },
  })
}
