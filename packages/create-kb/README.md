# @yuer678/create-kb

> [kb-ui](https://github.com/anyuer678/kb-ui) 脚手架 CLI：**7 种项目模板**一键创建，CLI 命令名仍是 `create-kb`。

> ⚠️ npm 上的 `create-kb`（无 scope）是**同名无关项目**，本包因此发布为 scoped 名 `@yuer678/create-kb`。

## 使用

```bash
npx @yuer678/create-kb my-app                     # 交互式选择模板
npx @yuer678/create-kb my-api --template api      # 直接指定模板（7 选 1）
npx @yuer678/create-kb my-app --no-git -p npm     # 不初始化 git / 指定包管理器
```

## 模板

| 模板 | 说明 |
|------|------|
| `base` | 最小可用 Vue 3 + Vite + TS 前端 |
| `starter` | 带完整组件示例的前端（预装 [kb-ui-vue](https://www.npmjs.com/package/kb-ui-vue)） |
| `api` | Express + TypeScript + Zod 后端（源码与 [@yuer678/kb-api](https://www.npmjs.com/package/@yuer678/kb-api) 同步，含 supertest 测试） |
| `fullstack` | Vue 前端 + Express API + Docker Compose 一键起 |
| `electron` | Electron 桌面应用骨架（安全模型 + 打包） |
| `react` | React 19 + Vite 前端 |
| `ai` | LLM 工作台（OpenAI 兼容 + SSE 流式 + 聊天前端） |

## 相关包

- [`kb-ui-vue`](https://www.npmjs.com/package/kb-ui-vue) —— Vue 3 组件库（73 组件 / 46 主题）
- [`@yuer678/kb-utils`](https://www.npmjs.com/package/@yuer678/kb-utils) —— 通用 TS 工具函数库
- [`@yuer678/kb-api`](https://www.npmjs.com/package/@yuer678/kb-api) —— 参考后端（模板内后端与其同源同步）
- 仓库：<https://github.com/anyuer678/kb-ui>

## License

MIT
