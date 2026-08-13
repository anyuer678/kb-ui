# KB UI Monorepo

一套自建的 Vue 3 构建模板与组件库（pnpm workspace monorepo）。

## 包含的包

| 包 | 说明 |
|---|---|
| `@kb/ui` | 通用 Vue 3 组件库（发布 npm） |
| `@kb/config` | 共享工程配置（tsconfig / eslint / prettier / stylelint） |
| `kb-playground` | 组件演示站（源码直连热更新） |
| `kb-docs` | Vitepress 组件文档站 |
| `create-kb` | 项目脚手架 CLI（发布 npm） |

## 快速创建项目

```bash
pnpm create kb my-app          # 生成最小项目（Vite + Vue 3 + TS + @kb/ui）
pnpm create kb --template starter   # 生成带完整示例的项目
pnpm create kb                 # 交互式选择
```

## 发布流程

组件库与脚手架通过 [changesets](https://github.com/changesets/changesets) 管理版本与 changelog：

1. 改动后运行 `pnpm changeset`，按提示选择变更级别（major/minor/patch）并填写说明；
2. 推送代码，CI 自动执行 lint / typecheck / test / build；
3. GitHub Actions 自动创建「版本 PR」（更新 CHANGELOG 与版本号），合入后自动发布 `@kb/ui` 与 `create-kb` 到 npm。

> 首次发布前需在 GitHub 仓库 Secrets 配置 `NPM_TOKEN`（npm 账号的 automation token）。

## 常用命令

```bash
pnpm install       # 安装依赖
pnpm lint          # 全部包 lint
pnpm typecheck     # 全部包类型检查
pnpm test          # 全部包测试
pnpm build         # 全部包构建
pnpm dev           # 启动 playground（http://localhost:5173）
pnpm docs:dev      # 启动文档站（http://localhost:5174）
```

## 如何新增一个组件（@kb/ui）

在 `packages/ui/src/components/<Name>/` 下创建 4 个文件（以 Button 为范式）：

```
<Name>.vue                  # 组件：defineOptions({ name: 'Kb<Name>' }) + withDefaults(defineProps<Props>())
style.css                   # 样式：全部引用 --kb-* token，class 前缀 kb-
index.ts                    # 导出组件与 Props 类型
__tests__/<Name>.spec.ts    # Vitest 测试
```

然后在两个汇总文件中各追加一行：

- `packages/ui/src/index.ts`：`export * from './components/<Name>'` + 加入 `components` 数组
- 构建脚本会自动把 `style.css` 输出为 `dist/styles/<Name>.css`

## 技术栈

Vue 3 + TypeScript + Vite（lib mode）+ Vitest + pnpm workspace，样式为原生 CSS + CSS 变量（设计 token）。设计文档见 `docs/superpowers/specs/`，实施计划见 `docs/superpowers/plans/`。
