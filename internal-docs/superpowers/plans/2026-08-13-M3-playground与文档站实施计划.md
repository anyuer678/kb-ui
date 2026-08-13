# M3 Playground 演示站 + Vitepress 文档站实施计划

> **For agentic workers:** Execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立组件即时预览环境（playground）与组件文档站（Vitepress），让 14 个 P0 组件可交互演示、有 API 文档，为后续 create-kb 模板提供"消费 @kb/ui"的参考实现。

**Architecture:** playground 是 Vite + Vue 3 应用，通过 vite alias 直连 `@kb/ui` 源码实现热更新预览；docs 是 Vitepress 站点，`theme/index.ts` 里 `app.use(KbUi)` 注册全组件并在 md 中直接书写组件示例（参考掘金实操：docs/theme/index.js + app.use + base 配置）。

**Tech Stack:** Vite 8（playground）、Vitepress 1.6（docs）、Vue 3.5、@kb/ui（workspace 引用）。

## Global Constraints

- playground 与 docs 加入根 pnpm workspace（`pnpm-workspace.yaml` 追加两目录）。
- playground 通过 vite alias 引用源码（`@kb/ui` → `packages/ui/src/index.ts`），样式按需 import 源码 css。
- docs 站点根为 `docs/`，现有 `docs/superpowers/` 与 `docs/research/` 原样保留（不被站点引用）。
- 组件文档覆盖全部 14 个 P0 组件：用法示例 + props 表格。
- 每任务结束提交（Conventional Commits）。

---

### Task 1: Playground 初始化

**Files:**
- Modify: `pnpm-workspace.yaml`（追加 playground、docs）
- Create: `playground/package.json`
- Create: `playground/vite.config.ts`
- Create: `playground/index.html`
- Create: `playground/src/main.ts`
- Create: `playground/src/App.vue`（骨架）

**Interfaces:**
- Consumes: `@kb/ui` 源码（alias）
- Produces: `pnpm dev` 可启动、热更新预览

- [ ] **Step 1: workspace 追加目录**

```yaml
packages:
  - packages/*
  - playground
  - docs
```

- [ ] **Step 2: playground/package.json**

```json
{
  "name": "kb-playground",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": { "@kb/ui": "workspace:*", "vue": "^3.5.0" },
  "devDependencies": { "@vitejs/plugin-vue": "^6.0.0", "typescript": "^5.9.0", "vite": "^8.0.0", "vue-tsc": "^3.0.0" }
}
```

- [ ] **Step 3: vite.config.ts（alias 直连源码）**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@kb/ui': fileURLToPath(new URL('../packages/ui/src/index.ts', import.meta.url)),
    },
  },
})
```

- [ ] **Step 4: index.html + main.ts**（挂载 #app，引入源码全量样式 `../packages/ui/src/styles/index.css`）
- [ ] **Step 5: App.vue 骨架**（标题 + 区块容器样式）
- [ ] **Step 6: 安装依赖 + `pnpm dev` 启动验证**（后台起 dev server 或 `vite build` 验证可编译）
- [ ] **Step 7: Commit**

### Task 2: Playground 展示全部 14 组件

**Files:**
- Modify: `playground/src/App.vue`

**Interfaces:**
- Consumes: 全部 Kb* 组件
- Produces: 可交互演示页

- [ ] **Step 1: 基础组件区**——Button（6 类型 × 3 尺寸 + disabled/round/plain）、Icon（12 图标 grid）、Tag（类型/closable）、Space（方向）、Divider、Grid（Row/Col 布局示例）
- [ ] **Step 2: 表单区**——Input（v-model + clearable）、Checkbox、Radio（两个选项联动）、Switch、Select（v-model 联动显示选中）
- [ ] **Step 3: 反馈区**——Tooltip（各 placement）、Dialog（按钮打开 + 关闭）、Message（四个函数按钮触发）
- [ ] **Step 4: 数据区**——Table（stripe + cell slot 自定义）
- [ ] **Step 5: `pnpm --filter kb-playground build` 验证 + Commit**

### Task 3: Vitepress 文档站初始化

**Files:**
- Create: `docs/package.json`
- Create: `docs/.vitepress/config.ts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/style.css`
- Create: `docs/index.md`
- Create: `docs/guide/quickstart.md`
- Create: `docs/guide/theme.md`

**Interfaces:**
- Consumes: `@kb/ui`（全量注册）
- Produces: `pnpm docs:dev` 可预览文档站

- [ ] **Step 1: docs/package.json**（vitepress + vue + @kb/ui；scripts: docs:dev/docs:build/docs:preview）
- [ ] **Step 2: .vitepress/config.ts**——title/sidebar（指南 + 14 组件）
- [ ] **Step 3: theme/index.ts**——`import DefaultTheme from 'vitepress/theme'; import KbUi from '@kb/ui'; export default { ...DefaultTheme, enhanceApp({ app }) { app.use(KbUi) } }` + 引入样式（@kb/ui 全量 css——docs 用打包后的 dist？开发时 @kb/ui 是 workspace 包，exports 指向 dist。docs 需要先 build ui。为开发方便，theme 里 import '@kb/ui/src/styles/index.css'？Vitepress 的 resolve 也能用 alias？docs 的 vite 配置通过 vitepress 自定义。简化：docs 依赖 @kb/ui workspace:*，Vitepress 会解析包 exports 的 dist（需先 pnpm build @kb/ui）。theme/index.ts import '@kb/ui/dist/index.css'？我们没有 dist/index.css（样式在 dist/styles/index.css）。
  - 方案：theme 里 `import '@kb/ui/styles/index.css'`——exports "./styles/*": "./dist/styles/*"，所以 '@kb/ui/styles/index.css' → dist/styles/index.css ✓（含 tokens + dark）。组件样式不需要（文档示例用全量）。
- [ ] **Step 4: index.md 首页** + quickstart.md（安装/引入/按需） + theme.md（CSS 变量定制 + 暗色）
- [ ] **Step 5: 验证 `pnpm docs:build` + Commit**

### Task 4: 14 个组件文档页

**Files:**
- Create: `docs/components/<name>.md` × 14（button/icon/tag/space/divider/grid/input/checkbox/radio/switch/select/tooltip/dialog/message/table）

**Interfaces:**
- Consumes: 组件 + playground 示例代码
- Produces: 每组件一页（示例 + API 表格）

- [ ] **Step 1: 模板化文档结构**——标题、简介、示例（::: demo 或直接渲染 + 代码块）、API props 表格（列：名称/类型/默认值/说明）
- [ ] **Step 2-15: 逐组件写文档**（从 playground 的示例代码复制，props 表从组件源码提取）
- [ ] **Step 16: `pnpm docs:build` 验证全部页面可构建 + Commit**

### Task 5: 全量验证收尾

- [ ] **Step 1: 根 scripts 增加 docs 相关命令**（docs:dev/docs:build）
- [ ] **Step 2: 全量验证**——`pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm --filter @kb/ui build`、`pnpm --filter kb-playground build`、`pnpm docs:build`
- [ ] **Step 3: Commit + README 更新（playground/docs 用法）**

---

## Self-Review

- **Spec coverage**：设计文档 §7（playground + Vitepress 文档站）→ Task 1-4 ✅；§4.2 全部 14 组件 → Task 2/4 全覆盖 ✅。
- **Placeholder scan**：无 TBD/TODO；示例代码从已完成的组件源码/测试提取，无虚构 API。
- **Type consistency**：docs 全量引入走 `@kb/ui` exports 的 `./styles/index.css`；playground 走源码 alias，两处入口不冲突。
- **遗留**：create-kb（M4）、CI/发布（M5）。
