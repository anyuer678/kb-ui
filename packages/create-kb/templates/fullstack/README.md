# {{projectName}}

全栈项目模板：**Vue 3 前端 + Express API + Docker Compose**。

## 目录

```
├── web/        # Vue 3 + Vite 前端（:5173）
├── server/     # Express + TypeScript + Zod API（:3000）
└── docker-compose.yml
```

## 开发模式

```bash
pnpm install
pnpm dev        # 同时启动 web + api（concurrently）
```

- 前端 http://localhost:5173（/api 已代理到 3000）
- API 文档见 server/README 或直接访问 /health

## 一键容器化部署

```bash
pnpm docker:up     # docker compose up -d --build
pnpm docker:down
```

- Web http://localhost:8080
- API http://localhost:3000

## 测试

```bash
pnpm test          # API 集成测试（vitest + supertest）
```
