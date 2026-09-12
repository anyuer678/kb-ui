/* eslint-disable */
// ⚠️ 自动生成文件，请勿直接修改。
// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。
import { Router } from 'express'
import { HttpError } from '../middleware/error'
import { REGION_NODE_COUNT, childrenOf, findRegion, regionTree, toSummary } from '../data/regions'

// 显式标注类型：否则 dts 生成会因 pnpm 的 .pnpm 路径而报 TS2742（类型不可命名）
export const regionsRouter: Router = Router()

/** GET /regions/tree —— 完整嵌套树（440 个节点），供 Tree 虚拟滚动使用 */
regionsRouter.get('/tree', (_req, res) => {
  res.json({ list: regionTree, total: REGION_NODE_COUNT })
})

/**
 * GET /regions?parent=<value>
 * 只返回下一级节点摘要（不带 children），节点不存在时 404。
 * Cascader 的 lazyLoad 直接消费返回的 leaf 字段判断末级。
 */
regionsRouter.get('/', (req, res) => {
  const parent = typeof req.query.parent === 'string' && req.query.parent ? req.query.parent : null
  if (parent && !findRegion(parent)) throw new HttpError(404, `节点不存在: ${parent}`)

  const children = childrenOf(parent) ?? []
  res.json({
    parent,
    list: children.map(toSummary),
    leaf: children.length === 0,
  })
})
