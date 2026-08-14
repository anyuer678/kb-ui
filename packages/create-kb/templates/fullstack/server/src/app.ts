import express from 'express'
import { healthRouter } from './routes/health'
import { itemsRouter } from './routes/items'
import { notFoundHandler, errorHandler } from './middleware/error'

/** 创建 Express 应用（与 index.ts 分离，便于测试） */
export function createApp() {
  const app = express()

  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({ name: '{{projectName}}-api', version: '0.0.0' })
  })
  app.use('/health', healthRouter)
  app.use('/items', itemsRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
