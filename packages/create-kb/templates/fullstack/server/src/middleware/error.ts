import type { Request, Response, NextFunction } from 'express'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ code: 404, message: '接口不存在' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('[error]', err)
  res.status(500).json({ code: 500, message: '服务器内部错误' })
}
