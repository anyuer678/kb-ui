import { startServer } from './server'

/** 模板入口：端口默认 3000（与 docker-compose、web 代理保持一致），可用 PORT 覆盖 */
const port = Number(process.env.PORT ?? 3000)

startServer({ port, name: '{{projectName}}-api' }).catch((error: unknown) => {
  console.error('[api] 启动失败:', error)
  process.exitCode = 1
})
