# npm 发布策略（kb-ui-vue 与 @yuer678/*）

## 现状（2026-09-24）

| 包 | npm 名 | 状态 |
|----|--------|------|
| 组件库 | `kb-ui-vue` | **已发布**（0.4.0 起，Release 工作流自动发） |
| 工具库 | `@yuer678/kb-utils` | **已发布**（随 2026-09-24 Path B 上线） |
| API 参考后端 | `@yuer678/kb-api` | **已发布**（同上） |
| 脚手架 | `@yuer678/create-kb` | **已发布**（同上；CLI 命令名仍是 `create-kb`） |
| 共享配置 | `@kb/config` | 私有，workspace 内部 |
| `kb-playground` / `kb-docs` | — | 私有 |

## 决策记录

### Path A（2026-09-20）

对外只推广 `kb-ui-vue`；`@kb/utils` / `@kb/api` / `create-kb` 放 changesets `ignore`，避免「文档写得到、npm 装不到」。

### Path B（2026-09-24，执行完毕）

全部发布包迁到用户 scope `@yuer678/*`：

- `@kb/utils` → `@yuer678/kb-utils`
- `@kb/api` → `@yuer678/kb-api`
- `create-kb` → `@yuer678/create-kb`

迁移原因：

1. npm 上的无 scope `create-kb` 是同名无关项目（`adamBoualleiguie/knowledge-base`，维护者 `kb-base`），直接发必 403；
2. `@kb` scope 需要 npm org，归属未确认（两字母名大概率被占），而用户 scope 零外部依赖、现有 token 即可发。

随迁改动：playground（依赖 / 导入 / vite 别名 / tsconfig paths）、docs 与各 README、changesets（`ignore` 移除三项 + changeset 文件头改新包名）、`sync-api-template.mjs` 注释、`release.yml` 注释。模板生成的项目内嵌后端源码、不依赖 `@yuer678/kb-api`，无需改。

`.changeset/config.json` 的 `ignore` 只剩内部包：`["@kb/config", "kb-playground", "kb-docs"]`。

## 验收（Issue #21）

- [x] README / docs 与 npm 实际可安装名一致
- [x] 不再出现「文档写 @kb/utils 但 npm 装不到」
- [x] 选定路径（A 先行、B 收尾）并在 PR 描述写明
- [x] 迁移后的三个包 publish 成功且 `npm i` 可用

## 与 design-assets

素材库**不**进入 npm 运行时依赖；仅文档/PPT 引用。
