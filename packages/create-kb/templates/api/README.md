# {{projectName}}-api

Express + TypeScript + Zod 的 API 服务模板。

## 快速开始

```bash
pnpm install
pnpm dev        # 开发模式（热重载），http://localhost:3000
pnpm test       # 运行测试（vitest + supertest）
```

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /health | 健康检查 |
| GET | /items | 列表（?done=true 过滤） |
| GET | /items/:id | 详情 |
| POST | /items | 创建（zod 校验） |

## 结构

```
src/
├── app.ts          # 创建 app（可测试）
├── index.ts        # 入口（监听端口）
├── routes/         # 路由
├── middleware/     # zod 校验 / 错误处理
└── data/           # 内存数据（演示）
test/               # supertest 集成测试
```
