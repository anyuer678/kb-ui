/* eslint-disable */
// ⚠️ 自动生成文件，请勿直接修改。
// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。
import { Router } from 'express'
import { parsePageQuery, queryList } from '../query'
import { options } from '../data/options'

// 显式标注类型：否则 dts 生成会因 pnpm 的 .pnpm 路径而报 TS2742（类型不可命名）
export const optionsRouter: Router = Router()

/**
 * GET /options?keyword=&page=&pageSize=
 * 240 条候选项的分页 + 搜索，供 Transfer 的搜索过滤与分页演示取数。
 * 返回的 total 是过滤后的条数，前端可直接用它算总页数。
 */
optionsRouter.get('/', (req, res) => {
  const query = parsePageQuery(req.query as Record<string, unknown>)
  res.json(queryList(options, query, { searchFields: ['label'], sortKeys: ['key', 'label'] }))
})
