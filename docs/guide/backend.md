# 后端模块与请求层

组件库只解决「界面」，一个能跑起来的示例往往还差两件事：**一个不用配数据库就能用的后端**，
和**一层统一处理 baseURL / 超时 / 重试的请求封装**。这两块分别由 `@kb/api` 与 `@kb/utils`
的 `createHttp` 提供。

## 为什么单独做成包

之前的后端只存在于 `create-kb` 的脚手架模板里——它是「拷贝一次就丢」的快照，改动不会回流。
现在后端有唯一实现 `@kb/api`：

- **可 `import`**：直接 `import { createApp } from '@kb/api'`，挂到自己的服务里
- **可当 mock**：`pnpm api` 起一个本地服务，前端不必再手写假数据
- **模板复用源码**：`create-kb` 的 `api` / `fullstack` 模板由 `pnpm sync:api-template` 从本包生成

## 起一个本地后端

```bash
pnpm api            # tsx watch，默认 http://127.0.0.1:8082
PORT=9000 pnpm api  # 换端口
```

启动后 `http://127.0.0.1:8082/` 会列出全部可用接口。

## 内置接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 接口清单 |
| GET | `/health` · `/api/health` | 健康检查（带前缀/不带前缀都有，方便容器探活） |
| GET | `/api/users` | 用户列表：`?page=&pageSize=&keyword=&sortBy=&order=` |
| GET | `/api/users/:id` | 用户详情 |
| POST | `/api/users` | 创建用户（Zod 校验） |
| DELETE | `/api/users/:id` | 删除用户 |
| GET | `/api/regions` | 下一级区域：`?parent=<value>`，供 Cascader 懒加载 |
| GET | `/api/regions/tree` | 完整区域树（440 节点），供 Tree 虚拟滚动 |
| GET | `/api/options` | 候选项：`?keyword=&page=&pageSize=`，供 Transfer 搜索分页 |

列表接口统一返回 `{ list, total, page, pageSize }`，`total` 是**过滤后**的总数，可直接喂给
`KbTable` 的 `total` 属性做服务端分页。

## 在代码里挂载

```ts
import { createApp, startServer } from '@kb/api'

// 1) 交给现有服务挂载
const app = createApp({ name: 'my-api', cors: true })
app.listen(3000)

// 2) 或直接起服务（listen 成功后 resolve 出 Server，便于优雅退出）
const server = await startServer({ port: 8082 })
```

自定义中间件、换服务名、关掉 CORS：

```ts
createApp({
  name: 'my-api',
  cors: false,
  middleware: [(req, _res, next) => (console.log(req.method, req.url), next())],
})
```

## 换掉内存数据

`src/data/*` 只暴露「读列表 / 查单个 / 新建 / 删除」这几个访问器，路由与校验层不关心数据从哪来。
接真实数据库时替换这一层即可：

```ts
// packages/api/src/data/users.ts
export async function listUsers(): Promise<User[]> {
  return db.user.findMany()      // 换成 Prisma / Drizzle / SQL 都行
}
```

## 前端请求层：`createHttp`

`@kb/utils` 提供一层基于原生 `fetch` 的请求封装，零运行时依赖：

```ts
import { createHttp } from '@kb/utils'

const http = createHttp({
  baseURL: '/api',
  timeout: 8000,
  retries: 1,          // 网络错误与 5xx 自动重试（指数退避），4xx 不重试
})

const page = await http.get<PageResult<User>>('/users', {
  params: { page: 1, pageSize: 20, sortBy: 'score', order: 'desc' },
})
```

- **`params` 自动拼接**，`undefined` / `null` / 空串会被跳过，不必手写三元
- **超时**用 `AbortController` 实现，也可以在 `RequestOptions` 里传自己的 `signal`
- **钩子**：`onRequest`（改配置，比如注入 token）、`onResponse`、`onError`
- **错误统一为 `HttpError`**：`status` 为 0 表示网络错误/超时，否则是真实 HTTP 状态码，`data` 带响应体
- **测试友好**：`createHttp({ fetch })` 可注入自定义 fetch，无需起真实服务

## 前后端联调

开发态用 Vite 代理把 `/api` 转给后端即可（`playground/vite.config.ts` 就是这么做的）：

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: { '/api': { target: 'http://127.0.0.1:8082', changeOrigin: true } },
  },
})
```

`pnpm start:full` 会同时拉起 playground、docs 与后端；playground 的「真实接口 · @kb/api」
一节演示了服务端分页排序（`KbTable` 的 `sortable: 'custom'` + `total`）、Cascader 远程懒加载
与 Tree 远程树数据。

## 与脚手架模板的关系

`create-kb` 的 `api`、`fullstack` 模板不自己维护后端代码，`src/` 由脚本从 `packages/api` 同步：

```bash
pnpm sync:api-template         # 同步
pnpm sync:api-template:check   # 校验是否漂移（CI 会执行）
```

模板里唯一手写的文件是入口 `src/index.ts`（默认端口 3000，与 docker-compose 及 web 代理一致）。
因此改后端只需改 `packages/api`，改完跑一次同步，模板即自动跟进。
