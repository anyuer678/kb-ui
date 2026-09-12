---
'create-kb': minor
---

create-kb 的 api / fullstack 模板不再自带一份后端拷贝，改为从 `@kb/api` 同步：

- 新增 `scripts/sync-api-template.mjs`：以 `packages/api` 为唯一源，把源码铺进 `templates/api` 与
  `templates/fullstack/server`；`pnpm sync:api-template` 写入，`pnpm sync:api-template:check` 校验漂移（可用于 CI）
- 模板后端能力同步升级：分页/排序/搜索流水线、`/api/users`、`/api/regions`（树 + 懒加载）、`/api/options`、
  CORS、统一错误中间件与 Zod 校验，自带 21 例 supertest 集成测试
- 修复 `kbVersion()` 读取旧包名 `@kb/ui` 导致始终回退到 `latest` 的问题（改为 `kb-ui-vue`）
- `templates/fullstack/server` 补上缺失的 `tsconfig.json` 与 `vitest.config.ts`
- 模板入口仍是 `src/index.ts`（默认端口 3000，与 docker-compose / web 代理一致）
