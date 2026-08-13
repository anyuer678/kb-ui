# KB UI Monorepo

一套自建的 Vue 3 构建模板与组件库（pnpm workspace monorepo）。

## 包含的包

| 包 | 说明 |
|---|---|
| `@kb/ui` | 通用 Vue 3 组件库（发布 npm） |
| `@kb/config` | 共享工程配置（tsconfig / eslint / prettier / stylelint） |

（后续将新增 `create-kb` 脚手架、playground 演示站、docs 文档站）

## 常用命令

```bash
pnpm install       # 安装依赖
pnpm lint          # 全部包 lint
pnpm typecheck     # 全部包类型检查
pnpm test          # 全部包测试
pnpm build         # 全部包构建
```

## 技术栈

Vue 3 + TypeScript + Vite（lib mode）+ Vitest + pnpm workspace，样式为原生 CSS + CSS 变量（设计 token）。设计文档见 `docs/superpowers/specs/`，实施计划见 `docs/superpowers/plans/`。
