/* eslint-disable */
// ⚠️ 自动生成文件，请勿直接修改。
// 源：packages/api/src —— 改动请改源文件后运行 `pnpm sync:api-template`。
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import type { ZodType } from 'zod'

/** zod 校验中间件：校验通过后把解析结果挂回 req.body，失败返回 400 与字段级错误 */
export function validate(schema: ZodType): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({
        code: 400,
        message: '参数校验失败',
        errors: result.error.flatten().fieldErrors,
      })
      return
    }
    req.body = result.data
    next()
  }
}
