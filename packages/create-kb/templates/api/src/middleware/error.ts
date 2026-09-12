/* eslint-disable */
// ⚠️ 自动生成文件，请勿直接修改。
// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。
import type { Request, Response, NextFunction } from 'express'

/** 统一的 404 响应，挂在所有路由之后 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ code: 404, message: `接口不存在: ${req.method} ${req.path}` })
}

/** 统一错误响应，Express 5 会自动捕获 async 路由里抛出的异常并转到这里 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : String(err)
  const status = err instanceof HttpError ? err.status : 500
  if (status >= 500) console.error('[api] 未捕获异常:', err)
  res.status(status).json({ code: status, message: status >= 500 ? '服务器内部错误' : message })
}

/** 路由里可以直接 throw new HttpError(404, '未找到') */
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}
