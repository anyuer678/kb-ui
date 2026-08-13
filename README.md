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
