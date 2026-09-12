---
'@kb/api': minor
'@kb/utils': minor
---

新增可复用的后端模块 `@kb/api` 与配套请求层：

**`@kb/api`（新包）** —— 一个可直接 `import` 的 Express 5 + Zod 4 后端：

- `createApp(options?)` 返回可挂载的 Express 应用，`startServer(options?)` 一键起服务（默认 `127.0.0.1:8082`）
- 内置 `/health` 与 `/api/*` 两套健康检查、`/api/users`（分页 / 排序 / 搜索，字段与排序键白名单）、`/api/regions`（树形 + 懒加载 `parentId`）、`/api/options` 演示数据
- 统一错误中间件（`HttpError` / `notFoundHandler` / `errorHandler`）与 Zod 校验中间件 `validate(schema)`
- 内置 CORS、内存合成数据层（`src/data/*`，确定性生成，无需数据库）、`tsup` 双格式构建（esm + cjs + d.ts）
- 自带 `kb-api` CLI（`bin` 入口）：`npx kb-api --port 9000 --host 0.0.0.0` 直接起服务，也支持 `PORT` / `HOST` 环境变量
- 与 `create-kb` 的 api 模板同源，脚手架项目无需重复维护一份后端

**`@kb/utils` HTTP 请求层** —— 新增 `createHttp`：

- 基于原生 `fetch`，零运行时依赖；统一 `baseURL` / `params` / 超时（AbortController）/ 请求与响应钩子
- `HttpError` 带 `status`（网络错误为 0）与响应体；`withQuery` 自动跳过空值
- 可选失败重试：复用 `retry` 做指数退避，默认只对网络错误与 5xx 重试，4xx 不重试
- `retry` 新增 `shouldRetry` 判定参数（向后兼容）
