# @kb/api

可复用的参考后端服务（Express 5 + TypeScript + Zod）。它不是「生成一次就丢」的脚手架，而是一个**能被 import 的包**：既给仓库内的 playground / docs / e2e 提供真实数据，也可以在你自己的项目里当成 mock 后端直接起起来。

## 为什么需要它

组件库最容易缺的一环是「异步链路没法验证」——分页、排序、树形懒加载这些能力，用内联静态数组演示是看不出问题的。这个包把数据与接口沉淀成一处，让组件演示和本地联调都走真实 HTTP。

## 快速开始

```bash
# 方式一：仓库内开发（tsx watch，改源码即时重启）
pnpm --filter @kb/api dev               # 默认 http://127.0.0.1:8082

# 方式二：构建后用自带 CLI 起服务
pnpm --filter @kb/api build
npx kb-api                              # 端口默认 8082
npx kb-api --port 9000 --host 0.0.0.0   # 换端口 / 对外暴露（容器内需要）

# 方式三：装进你自己的项目当依赖
pnpm add -D @kb/api
```

`kb-api --help` 可看全部参数；端口与地址也可用环境变量 `PORT` / `HOST` 覆盖，命令行参数优先级更高。`npm i -g @kb/api` 之后可以直接敲 `kb-api`。

## 接口一览

所有业务接口挂在 `/api` 前缀下，健康检查额外提供无前缀的 `/health`。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 探活，返回服务名、版本与 uptime |
| GET | `/api/users` | 用户列表，支持 `page` / `pageSize` / `keyword` / `sortBy` / `order` |
| GET | `/api/users/:id` | 用户详情，不存在返回 404 |
| POST | `/api/users` | 创建用户，Zod 校验失败返回 400 与字段级错误 |
| DELETE | `/api/users/:id` | 删除用户，成功返回 204 |
| GET | `/api/regions?parent=<value>` | 下一级区域节点（不带 children），`leaf` 标出末级 —— 供级联选择/树懒加载 |
| GET | `/api/regions/tree` | 完整嵌套树（440 个节点），供树形控件虚拟滚动 |
| GET | `/api/options?keyword=&page=&pageSize=` | 240 条候选项，供穿梭框搜索与分页 |

### 列表响应约定

分页接口统一返回 `{ list, total, page, pageSize }`，`total` 是**过滤后**的条数，前端可直接用它算总页数。

排序只接受白名单内的字段（见 `USER_SORT_KEYS`），白名单外一律忽略，避免任意字段排序。`page` / `pageSize` 非法时回退默认值，`pageSize` 上限 500。

### 错误响应约定

```json
{ "code": 404, "message": "用户不存在: 999999" }
```

校验失败额外带 `errors`（字段 → 错误信息数组）。

## 在你自己的项目里复用

### 起一个独立 mock 服务

```ts
import { startServer } from '@kb/api'

await startServer({ port: 9000, name: 'my-mock' })
```

### 挂到已有 Express 应用上

```ts
import express from 'express'
import { createApp } from '@kb/api'

const app = express()
app.use('/mock', createApp({ name: 'my-mock' }))
app.listen(3000)
```

### 只借用查询与校验能力

`queryList` / `parsePageQuery` 是与框架无关的纯函数，可以直接用在你自己路由里，保证分页排序语义跟这套接口一致：

```ts
import { parsePageQuery, queryList } from '@kb/api'

app.get('/posts', (req, res) => {
  const query = parsePageQuery(req.query)
  res.json(queryList(posts, query, { searchFields: ['title'], sortKeys: ['createdAt'] }))
})
```

## 数据层

种子数据集中在 `src/data/`，全部是**确定性生成的合成数据**（用下标取模而非随机数，保证分页与测试可复现），不含任何真实行政区划或个人信息的含义。

`src/data/*` 是唯一直接操作数据的地方，路由层只调用导出的访问器（`listUsers` / `childrenOf` …）。想换成数据库，只需要重写这一层，路由与查询逻辑不用动。

## 与 create-kb 模板的关系

`packages/create-kb/templates/api` 的 `src` 目录**由本包同步而来**，不要再单独改模板里的后端源码：

```bash
pnpm sync:api-template          # 同步
pnpm sync:api-template --check  # 只校验是否漂移（CI 用）
```

这样仓库里只有一份后端实现，模板拿到的是同一套代码的拷贝（用户生成项目后可以完全拥有这份源码）。

## 测试

```bash
pnpm --filter @kb/api test
```

用 supertest 直接打真实 HTTP，覆盖分页、排序、搜索、树懒加载、校验失败、404 与 CORS 预检。
