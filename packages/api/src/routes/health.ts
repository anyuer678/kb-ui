import { Router } from 'express'
import type { ApiInfo } from '../types'

/** GET /health —— 探活接口，返回服务标识与运行时长 */
export function createHealthRouter(info: ApiInfo): Router {
  const router = Router()

  router.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      name: info.name,
      version: info.version,
      uptime: Math.round(process.uptime()),
    })
  })

  return router
}
