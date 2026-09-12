import express from 'express'
import type { Express, RequestHandler } from 'express'
import { createHealthRouter } from './routes/health'
import { usersRouter } from './routes/users'
import { regionsRouter } from './routes/regions'
import { optionsRouter } from './routes/options'
import { errorHandler, notFoundHandler } from './middleware/error'
import type { ApiInfo } from './types'

export interface CreateAppOptions {
  /** 服务名，会出现在根路由、健康检查与启动日志里 */
  name?: string
  version?: string
  /** 插在所有业务路由前的自定义中间件，方便加日志/鉴权/耗时统计 */
  middleware?: RequestHandler[]
  /** 是否放开跨域，默认开启，便于本地联调 */
  cors?: boolean
}

export const API_PREFIX = '/api'
export const DEFAULT_API_NAME = 'kb-api'
export const DEFAULT_API_VERSION = '0.1.0'

const ENDPOINTS = [
  'GET    /api/health',
  'GET    /api/users?page=&pageSize=&keyword=&sortBy=&order=',
  'GET    /api/users/:id',
  'POST   /api/users',
  'DELETE /api/users/:id',
  'GET    /api/regions?parent=<value>',
  'GET    /api/regions/tree',
  'GET    /api/options?keyword=&page=&pageSize=',
]

/** 手写 CORS，避免为一个 mock 服务再引一个依赖；预检请求直接 204 返回 */
function corsMiddleware(enabled: boolean): RequestHandler {
  return (req, res, next) => {
    if (!enabled) {
      next()
      return
    }
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    res.setHeader('Vary', 'Origin')
    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }
    next()
  }
}

/** 创建 Express 应用（与启动逻辑分离，便于 supertest 直接测） */
export function createApp(options: CreateAppOptions = {}): Express {
  const info: ApiInfo = {
    name: options.name ?? DEFAULT_API_NAME,
    version: options.version ?? DEFAULT_API_VERSION,
  }

  const app = express()
  app.use(express.json())
  app.use(corsMiddleware(options.cors ?? true))
  for (const middleware of options.middleware ?? []) app.use(middleware)

  app.get('/', (_req, res) => {
    res.json({ name: info.name, version: info.version, prefix: API_PREFIX, endpoints: ENDPOINTS })
  })

  const healthRouter = createHealthRouter(info)
  // 探活同时提供无前缀路径，方便容器/网关直接探测
  app.use('/health', healthRouter)
  app.use(`${API_PREFIX}/health`, healthRouter)
  app.use(`${API_PREFIX}/users`, usersRouter)
  app.use(`${API_PREFIX}/regions`, regionsRouter)
  app.use(`${API_PREFIX}/options`, optionsRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
