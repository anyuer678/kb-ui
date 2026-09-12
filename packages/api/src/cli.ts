#!/usr/bin/env node
import { DEFAULT_PORT, startServer } from './server'

const HELP = `kb-api —— 可直接运行的参考后端（Express 5 + Zod 4）

用法
  kb-api [--port <端口>] [--host <地址>]

选项
  --port <n>   监听端口，等价于环境变量 PORT（默认 ${DEFAULT_PORT}）
  --host <s>   监听地址，等价于环境变量 HOST（默认 127.0.0.1）
  -h, --help   显示本帮助

示例
  kb-api                      # http://127.0.0.1:${DEFAULT_PORT}/api
  kb-api --port 9000          # 换端口
  kb-api --host 0.0.0.0       # 对外暴露（容器内需要）
`

/** 极简参数解析：支持 `--port 9000` 与 `--port=9000` 两种写法 */
function readFlag(name: string, argv: string[]): string | undefined {
  const index = argv.findIndex((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`))
  if (index === -1) return undefined
  const arg = argv[index]
  if (arg.startsWith(`--${name}=`)) return arg.slice(name.length + 3) || undefined
  const next = argv[index + 1]
  return next && !next.startsWith('-') ? next : undefined
}

const argv = process.argv.slice(2)

if (argv.includes('-h') || argv.includes('--help')) {
  console.log(HELP)
  process.exit(0)
}

const port = Number(readFlag('port', argv) ?? process.env.PORT ?? DEFAULT_PORT)
const host = readFlag('host', argv) ?? process.env.HOST ?? '127.0.0.1'

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`[kb-api] 端口无效：${port}（应为 1-65535 的整数）`)
  process.exit(1)
}

startServer({ port, host, name: 'kb-api' }).catch((error: unknown) => {
  console.error('[kb-api] 启动失败:', error)
  process.exitCode = 1
})
