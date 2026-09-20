# npm 发布策略（@kb/* 与 create-kb）

## 现状

| 包 | npm 名 | 状态 |
|----|--------|------|
| 组件库 | `kb-ui-vue` | **已发布** 0.3.0 |
| 工具库 | `@kb/utils` | 未发布（changesets ignore） |
| API 参考后端 | `@kb/api` | 未发布 |
| 脚手架 | `create-kb` | 未发布（可能与 npm 上他人包名冲突） |

原因：`@kb` scope 归属需 npm org；`create-kb` 通用名易冲突。

## 推荐路径（按性价比）

### 路径 A — 聚焦 `kb-ui-vue`（推荐，短期）

1. 对外叙事只强调 **`kb-ui-vue`**
2. `@kb/utils` / `@kb/api` / `create-kb`：
   - 文档写「monorepo 内部/本地 `file:` 或 workspace 使用」
   - 或改名为未占用 scope：`@yuer-kb/utils`、`create-kb-ui`
3. changesets **ignore 保持**，避免误 publish 失败

### 路径 B — 完整 scope（中期）

1. npm 上创建 org（如 `@yuer-kb` 或验证能否获得 `@kb`）
2. 统一改 `package.json` `name`
3. 更新 `resolver` 文档与 templates 中的包名
4. 移出 changesets ignore，配置 `access: public`
5. CI：`changeset version` + `npm publish --provenance`（可选）

### 路径 C — create-kb 独立

- 发布为 `create-kb-ui` 或 `npx kb-ui-vue create`
- 保持模板在 monorepo，CLI 薄封装

## 验收（Issue #21）

- [ ] README / docs 与 npm 实际可安装名 **一致**
- [ ] 不会出现「文档写 @kb/utils 但 npm 装不到」
- [ ] 选定 A/B/C 之一并在 PR 描述写明
- [ ]（路径 B）至少一包成功 publish 且 `npm i` 可用

## 与 design-assets

素材库 **不**进入 npm 运行时依赖；仅文档/PPT 引用。


## 决策（Path A · 2026-09-20）

**选定路径 A**：对外只推广已发布的 `kb-ui-vue`。

| 包 | 对外名 | 说明 |
|----|--------|------|
| 组件库 | `kb-ui-vue` | npm 已发布，README 主入口 |
| `@kb/utils` | 仅 monorepo / workspace | 不在 npm 叙事中承诺可 `npm i @kb/utils` |
| `@kb/api` | 仅 monorepo | 同上 |
| `create-kb` | 建议后续改名 `create-kb-ui` | 通用名冲突；改名后再评估发布 |

changesets `ignore` 保持不变，避免误 publish。

Issue #21 可在 README 与 npm 名完全一致后关闭。


## CI / Release 说明（2026-09-20）

- `Release` 工作流：**无 token 或 token 无效时只 build**，不把 job 打成红叉
- 仓库 Secrets 中的 `NPM_TOKEN` 曾 **401**（`npm whoami` 失败），发版前请到 npm 重新生成 Automation Token 并更新 Secrets
- Dependabot 已忽略 vitest/playwright 等 peer 解析失败包；根目录 `.npmrc` 开启 `legacy-peer-deps`
