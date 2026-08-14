import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { items } from '../data/items'

export const itemsRouter = Router()

const createItemSchema = z.object({
  name: z.string().min(1).max(50),
  done: z.boolean().optional().default(false),
})

/** 列表：GET /items?done=true */
itemsRouter.get('/', (req, res) => {
  const done = req.query.done
  const list =
    done === undefined ? items : items.filter((i) => i.done === (done === 'true'))
  res.json(list)
})

/** 详情：GET /items/:id */
itemsRouter.get('/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id))
  if (!item) {
    res.status(404).json({ code: 404, message: '未找到该条目' })
    return
  }
  res.json(item)
})

/** 创建：POST /items */
itemsRouter.post('/', validate(createItemSchema), (req, res) => {
  const item = {
    id: items.length + 1,
    ...req.body,
  }
  items.push(item)
  res.status(201).json(item)
})
