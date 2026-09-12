# {{projectName}}-api

Express 5 + TypeScript + Zod 的参考后端服务。

> 本目录的 `src/` 与 `test/` 由 `scripts/sync-api-template.mjs` 从 **`packages/api`**（`@kb/api`）
> 自动生成，请勿直接修改；需要调整请改 `packages/api` 的源码后运行 `pnpm sync:api-template`。
> 只有 `src/index.ts`（启动入口）是模板自带的。

## 快速开始

```bash
pnpm install
pnpm dev        # 开发模式（热重载），http://localhost:3000
pnpm test       # 运行测试（vitest + supertest）
```

端口默认 `3000`，可用环境变量 `PORT` 覆盖。

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 列出可用接口 |
| GET | `/health` · `/api/health` | 健康检查（带前缀/不带前缀都有，方便容器探活） |
| GET | `/api/users` | 用户列表：`?page=&pageSize=&keyword=&sortBy=&order=` |
| GET | `/api/users/:id` | 用户详情 |
| POST | `/api/users` | 创建用户（zod 校验） |
| DELETE | `/api/users/:id` | 删除用户 |
| GET | `/api/regions` | 下一级区域：`?parent=<value>`（树形懒加载） |
| GET | `/api/regions/tree` | 完整区域树（440 节点） |
| GET | `/api/options` | 候选项列表：`?keyword=&page=&pageSize=` |

## 结构

```
src/
├── app.ts          # 创建 app（与启动分离，便于 supertest 直接测）
├── server.ts       # startServer()：listen 并 resolve 出 Server
├── index.ts        # 模板入口（端口 3000）
├── query.ts        # 搜索 → 排序 → 分页 的统一流水线
├── middleware/     # zod 校验 / 错误处理
├── routes/         # health / users / regions / options
└── data/           # 内存种子数据（换成数据库时只替换这一层）
test/               # supertest 集成测试
```

## 换成真实数据库

`src/data/*` 暴露的是「读列表 / 查单个 / 新建 / 删除」这几个访问器，路由只依赖它们。
把 `data/` 换成 Prisma / Drizzle / 原生 SQL 的实现即可，路由与校验层无需改动。
