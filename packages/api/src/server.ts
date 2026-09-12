import type { Server } from 'node:http'
import { createApp, DEFAULT_API_NAME } from './app'
import type { CreateAppOptions } from './app'

export interface StartServerOptions extends CreateAppOptions {
  /** 监听端口，默认读环境变量 PORT，否则 8082 */
  port?: number
  /** 监听地址，默认 127.0.0.1（本地 mock 不对外暴露） */
  host?: string
}

export const DEFAULT_PORT = 8082

/** 启动服务，listen 成功后 resolve 出 Server，便于脚本里追加逻辑或优雅退出 */
export function startServer(options: StartServerOptions = {}): Promise<Server> {
  const name = options.name ?? DEFAULT_API_NAME
  const port = options.port ?? Number(process.env.PORT ?? DEFAULT_PORT)
  const host = options.host ?? '127.0.0.1'
  const app = createApp(options)

  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => {
      console.log(`[${name}] 已启动: http://${host}:${port}/api`)
      resolve(server)
    })
    server.on('error', reject)
  })
}
