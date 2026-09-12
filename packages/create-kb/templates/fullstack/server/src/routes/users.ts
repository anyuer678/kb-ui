/* eslint-disable */
// ⚠️ 自动生成文件，请勿直接修改。
// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。
import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { HttpError } from '../middleware/error'
import { parsePageQuery, queryList } from '../query'
import {
  USER_SEARCH_FIELDS,
  USER_SORT_KEYS,
  createUser,
  findUser,
  listUsers,
  removeUser,
} from '../data/users'

const createUserSchema = z.object({
  name: z.string().min(1).max(50),
  company: z.string().max(50).optional(),
  city: z.string().max(30).optional(),
  email: z.string().max(80).optional(),
  role: z.string().max(20).optional(),
  score: z.number().int().min(0).max(100).optional(),
})

// 显式标注类型：否则 dts 生成会因 pnpm 的 .pnpm 路径而报 TS2742（类型不可命名）
export const usersRouter: Router = Router()

/**
 * GET /users?page=&pageSize=&keyword=&sortBy=&order=
 * 标准的分页 + 排序 + 搜索，直接对接 Table 的服务端模式（sortable: 'custom'）
 */
usersRouter.get('/', (req, res) => {
  const query = parsePageQuery(req.query as Record<string, unknown>)
  res.json(
    queryList(listUsers(), query, {
      searchFields: USER_SEARCH_FIELDS,
      sortKeys: USER_SORT_KEYS,
    }),
  )
})

usersRouter.get('/:id', (req, res) => {
  const user = findUser(Number(req.params.id))
  if (!user) throw new HttpError(404, `用户不存在: ${req.params.id}`)
  res.json(user)
})

usersRouter.post('/', validate(createUserSchema), (req, res) => {
  res.status(201).json(createUser(req.body))
})

usersRouter.delete('/:id', (req, res) => {
  if (!removeUser(Number(req.params.id))) throw new HttpError(404, `用户不存在: ${req.params.id}`)
  res.status(204).end()
})
