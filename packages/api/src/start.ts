import { startServer } from './server'

startServer().catch((error: unknown) => {
  console.error('[kb-api] 启动失败:', error)
  process.exitCode = 1
})
