# create-kb

## 0.3.1

### Patch Changes

- fea1c8d: npm 页面观感补齐：为 kb-utils / kb-ui-vue / create-kb 补包级 README（此前 npm 页面显示 "No README data found"）；为 kb-ui-vue 与 create-kb 补 package.json description；create-kb `--template` 帮助文案列全 7 种模板并修正 description 中残留的旧包名 `@kb/ui`；kb-api 与 create-kb 的版本号改为运行时读取自身 package.json（此前 `/health` 与 `--version` 硬编码 0.1.0）。
- Updated dependencies [fea1c8d]
  - kb-ui-vue@0.4.1

## 0.3.0

### Minor Changes

- d3634c9: create-kb 的 api / fullstack 模板不再自带一份后端拷贝，改为从 `@yuer678/kb-api` 同步：

  - 新增 `scripts/sync-api-template.mjs`：以 `packages/api` 为唯一源，把源码铺进 `templates/api` 与
    `templates/fullstack/server`；`pnpm sync:api-template` 写入，`pnpm sync:api-template:check` 校验漂移（可用于 CI）
  - 模板后端能力同步升级：分页/排序/搜索流水线、`/api/users`、`/api/regions`（树 + 懒加载）、`/api/options`、
    CORS、统一错误中间件与 Zod 校验，自带 21 例 supertest 集成测试
  - 修复 `kbVersion()` 读取旧包名 `@kb/ui` 导致始终回退到 `latest` 的问题（改为 `kb-ui-vue`）
  - `templates/fullstack/server` 补上缺失的 `tsconfig.json` 与 `vitest.config.ts`
  - 模板入口仍是 `src/index.ts`（默认端口 3000，与 docker-compose / web 代理一致）

## 0.2.0

### Minor Changes

- 首次正式发布：14 个基础组件（Button/Icon/Tag/Space/Divider/Grid/Input/Checkbox/Radio/Switch/Select/Tooltip/Dialog/Message/Table）+ create-kb 脚手架 CLI。

### Patch Changes

- Updated dependencies
  - @kb/ui@0.2.0
