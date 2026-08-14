import type { Request, Response, NextFunction, RequestHandler } from 'express'
import type { ZodTypeAny } from 'zod'

/** zod 校验中间件：校验通过后挂到 req.body */
export function validate(schema: ZodTypeAny): RequestHandler {
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
