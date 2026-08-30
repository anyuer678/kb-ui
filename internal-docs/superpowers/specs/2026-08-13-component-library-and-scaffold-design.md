# 自建构建模板与组件库 — 设计文档

- 日期：2026-08-13
- 状态：待用户批准
- 范围：一套可发布的 Vue 3 组件库（npm 包）+ 配套的项目脚手架（CLI + 模板）+ 统一的工程化底座（monorepo、打包、测试、CI、发布流程）

---

## 1. 背景与目标

用户需要一套"自己的"构建模板与组件库，实现：

1. **组件库**：发布为 npm 包，供多个项目复用；面向通用业务场景（不限定后台/大屏/官网），做一套通用的基础组件。
2. **构建模板**：既有"项目脚手架模板"（一键初始化新项目），又有"可复用构建配置"（组件库自身的打包/发布配置），两者一体设计、互相印证——脚手架生成的项目直接消费组件库。
3. 全部从零开始，建立一套可长期演进、可复用、可发布的工程化底座。

**成功标准：**

- `pnpm create kb <app>` 能生成一个可直接运行、预装组件库的新项目。
- `@kb/ui` 能打包出 ESM + CJS + 类型声明，通过 `pnpm -r publish` 发布到 npm。
- 组件库有统一的命名、样式、主题、API 规范，新增组件有固定的开发模板。
- 有自动化的质量保障：lint、类型检查、单元测试、CI、版本管理（changesets）。

---

## 2. 技术选型

| 领域 | 选择 | 理由 |
|---|---|---|
| 框架 | **Vue 3 + TypeScript** | SFC 单文件组件天然适合组件库开发（模板/脚本/样式内聚）；中文生态活跃、资料多；`<script setup>` + 泛型让组件类型友好；通用场景下 Vue 组件按需引入与 tree-shaking 开箱即用。 |
| 构建 | **Vite（library mode）+ vite-plugin-dts** | 与 Vue 生态同构；lib mode 直接输出 ESM + CJS；dts 插件自动生成类型声明；产物经 `vite build` 验证过、社区广泛使用。 |
| Monorepo | **pnpm workspace** | 组件库、脚手架、演示站、共享配置同仓管理；pnpm 对 workspace 链接与发布支持成熟；严格依赖隔离。 |
| 样式 | **原生 CSS + CSS 变量（设计 token）** | 零预处理器依赖、构建链最短、SSR 友好；CSS 变量天然支持主题切换（含暗色模式）；组件库内聚、不强制用户装 Sass。 |
| 测试 | **Vitest + @vue/test-utils** | 与 Vite 同构、零配置迁移；组件测试用 `@vue/test-utils` 是 Vue 官方推荐。 |
| 文档/演示 | **Vitepress**（演示站与组件文档） | Vue 官方文档方案，对 Vue 组件文档零成本；自带示例代码展示与搜索。 |
| 版本/发布 | **changesets** | 多包版本管理与 changelog 的标准方案，与 pnpm 集成良好。 |
| 脚手架 CLI | **commander + prompts + tsup** | commander 解析参数、prompts 做交互问答、tsup 把 CLI 打成单文件 bin 分发。 |
| Lint | **ESLint（vue + TS）+ Prettier + stylelint** | 统一代码风格；stylelint 约束 CSS 变量使用与顺序。 |
| 提交规范 | **Conventional Commits** | 与 changesets 的 changelog 生成配套。 |

**明确不做（YAGNI）：**

- 不引入 CSS-in-JS、不引入 UI 组件库做底层依赖（完全自研，保证"自己的"）。
- 不做 SSR 框架集成（Nuxt）专项适配，但组件本身 SSR 安全（无 window 依赖的副作用）。
- 不做 babel-plugin 按需引入插件——ESM + tree-shaking + 按组件样式文件已满足首版需求。
- 不做组件库内部图标字体包，图标用内联 SVG 组件。

---

## 3. 总体架构（Monorepo 布局）

工作区根目录即当前"知识库"目录。占位命名（见 §9 开放问题，可整体替换）：

```
知识库/
├── packages/
│   ├── ui/                      # @kb/ui —— 组件库（发布 npm）
│   ├── create-kb/               # create-kb —— 脚手架 CLI（发布 npm）
│   └── config/                  # @kb/config —— 共享工程配置（eslint/prettier/stylelint/tsconfig 预设，可选发布）
├── playground/                  # 组件库演示站点（Vite + Vue 3 + @kb/ui）
├── docs/                        # 设计文档 + 组件文档源（Vitepress）
│   └── superpowers/specs/       # 设计规格（本文件所在）
├── .changeset/                  # changesets 配置与变更记录
├── .github/workflows/           # CI（lint / test / build / publish）
├── pnpm-workspace.yaml
├── package.json                 # workspace root（仅脚本与依赖管理）
└── README.md
```

**依赖方向（单向）：**

```
create-kb (模板) ──预装──> @kb/ui
playground ────────────────> @kb/ui
docs (Vitepress) ──────────> @kb/ui
@kb/config <── 被 ui / create-kb / playground / docs 引用
```

`ui` 不依赖任何内部包；`config` 只包含纯配置；`create-kb` 只依赖 CLI 运行时依赖，模板内容静态存储。

---

## 4. 组件库设计（@kb/ui）

### 4.1 命名与包规范

- 包名：`@kb/ui`（占位，前缀 `kb` 呼应"知识库"）。
- 组件前缀：`Kb`（组件名 `KbButton`、标签 `<kb-button>`）。
- 版本策略：`0.x` 起步，`1.0` 前小版本可破坏性变更；遵守 Semantic Versioning。
- 依赖：`vue` 为 `peerDependencies`（`^3.4.0`），不锁定主依赖版本。

### 4.2 组件清单

**P0 —— 首版必须（14 个），覆盖基础/输入/反馈/展示/布局五类：**

| 类别 | 组件 |
|---|---|
| 基础 | Button、Icon、Tag、Space、Divider |
| 输入 | Input、Select、Checkbox、Radio、Switch |
| 反馈 | Tooltip、Dialog、Message |
| 数据展示 | Table |
| 布局 | Grid（Row/Col） |

**P1 —— 二期（13 个）：** Pagination、Tabs、Dropdown、Card、Skeleton、Empty、Avatar、Progress、Badge、Breadcrumb、Collapse、Alert、Form（表单校验）。

**P2 —— 远期（按需追加）：** DatePicker、Upload、Tree、Cascader、Drawer、Descriptions、Timeline、Carousel、Popover、Notification、VirtualList、Calendar 等。

P0 每个组件都必须有：实现、样式、类型、单元测试、文档示例。

### 4.3 组件 API 规范

- 全部使用 `<script setup lang="ts">` + `defineOptions({ name: 'KbButton' })`（保证组件名可被 devtools/递归组件识别）。
- props 用 `withDefaults(defineProps<Props>())` 强类型；事件用 `defineEmits` 声明；`v-model` 用 `modelValue` 约定（`update:modelValue`）。
- 对外暴露统一入口：具名导出（`import { KbButton } from 'kb-ui-vue'`）+ 全量注册插件（`app.use(KbUi)`）。
- 每个组件导出自带类型：`KbButtonProps` 等，供用户 `defineProps<KbButtonProps>()` 复用。
- 组件内部 `provide/inject` 用于 Form/Grid 等复合组件上下文，key 使用 `Symbol` 避免冲突。

### 4.4 样式与主题体系

**设计 token（CSS 变量，定义在 `src/styles/tokens.css`）：**

```
--kb-color-primary / success / warning / danger / info
--kb-color-bg / --kb-color-bg-elevated / --kb-color-border / --kb-color-text-{1..4}
--kb-radius-sm / md / lg / round
--kb-shadow-{1..3}
--kb-font-size-{xs..xl} / --kb-font-family
--kb-space-{1..8}  （4px 基数间距）
--kb-transition-duration / --kb-transition-timing
--kb-z-index-{modal,message,...}
```

- 组件样式全部通过 `var(--kb-*)` 引用 token，禁止硬编码色值/圆角/间距。
- 主题：`light`（默认）+ `dark`，以 `[data-theme='dark']` 作用于根节点切换；组件库提供 `src/styles/theme/dark.css` 覆盖 token。
- 样式组织：每个组件一个样式文件 `src/components/<Name>/style.css`，入口汇总；按需引入时用户可只引组件对应样式。
- 语义化 class 命名：`kb-<component>-<element>`（如 `kb-button__icon`），`--modifier` 用修饰类，避免样式污染。

### 4.5 按需引入与 tree-shaking

- 主入口 `src/index.ts` 导出全部组件与类型，纯 ESM 具名导出，Vite/Rollup/webpack 均可 tree-shake。
- 产物同时提供 `dist/index.js`（ESM）与 `dist/index.cjs`（CJS），`exports` 字段精确映射（见 §5）。
- 样式按组件拆分 `dist/styles/<Name>.css` + 全量 `dist/styles/index.css`。
- 不引入任何副作用（顶部无 `app.use()` 注册逻辑），保证 SSR 安全。

---

## 5. 打包与发布

### 5.1 产物形态（packages/ui）

```
dist/
├── index.js          # ESM
├── index.cjs         # CJS
├── index.d.ts        # 类型入口（+ 按组件的 .d.ts）
├── styles/
│   ├── index.css     # 全量样式
│   └── <Name>.css    # 按组件样式
└── theme/
    ├── light.css     # 亮色 token（默认已含于 index.css）
    └── dark.css      # 暗色覆盖
```

### 5.2 package.json 关键字段（packages/ui）

```jsonc
{
  "name": "kb-ui-vue",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles/*": "./dist/styles/*",
    "./theme/*": "./dist/theme/*",
    "./package.json": "./package.json"
  },
  "sideEffects": ["**/*.css"],
  "peerDependencies": { "vue": "^3.4.0" }
}
```

### 5.3 构建命令（packages/ui）

- `vite build`：lib mode，entry `src/index.ts`，formats `['es', 'cjs']`，`external: ['vue']`，CSS 按组件拆分输出。
- `vite-plugin-dts` 生成类型声明；`vue-tsc --noEmit` 做类型校验。
- 产物由 Vitepress 演示站与 playground 直接以 workspace 方式引用验证（边用边验，避免发布后发现坏包）。

### 5.4 发布流程

- changesets：每次改动 `pnpm changeset` 记录，PR 合入后 `pnpm changeset version` 统一升级版本与生成 changelog。
- 发布命令：`pnpm -r publish`（CI 中执行，带 `NPM_TOKEN`）。
- 包内 `files` 只含 `dist`，不发布源码与测试。

---

## 6. 脚手架设计（create-kb）

### 6.1 命令形态

```
pnpm create kb my-app              # 直接指定项目名
pnpm create kb                    # 交互式：项目名 → 包管理器 → 是否含示例页
pnpm create kb --template starter # 显式指定模板
```

### 6.2 模板

- `templates/base`：最小可用项目（Vite + Vue 3 + TS + 组件库预装 + 主题切换示例 + lint 配置 + README）。
- `templates/starter`：base 之上带一页示例页（表格 + 表单 + 消息反馈的完整用法）。
- 模板以静态文件存储，占位符形如 `{{projectName}}`、`{{packageName}}`，生成时替换。
- 模板**与 @kb/ui 的版本约定解耦**：生成时写入当前 `@kb/ui` 版本（脚手架运行时读取自己依赖的版本做模板替换），保证 `pnpm create` 拿到的新项目装的是配套版本。

### 6.3 实现要点

- 语言 TS，入口 `src/index.ts`，tsup 打成单文件 `bin/create-kb`。
- 交互：`prompts`（项目名、包管理器 pnpm/npm/yarn、模板选择）；参数优先、交互兜底。
- 生成：复制模板 → 替换占位符 → 可选 `git init` → 打印后续步骤（安装、启动）。
- 校验：项目名合法（npm 包名规则）、目标目录不存在或为空、重名询问覆盖。
- 发布 `create-kb` 到 npm；`pnpm create kb` 即 `npm exec create-kb`。

---

## 7. 演示站点与文档

- `playground/`：Vite + Vue 3 应用，作为组件开发时的即时预览（热更新），直接引用 workspace 中的 `@kb/ui` 源码。
- `docs/`：Vitepress 文档站，`pnpm docs:dev` 本地预览；内容包括快速上手、主题定制、每个组件的 API 表格 + 可运行示例。组件文档可在 P0 完成后随 P1 组件逐步补齐。

---

## 8. 质量保障与开发流程

- **测试**：Vitest + @vue/test-utils；每个 P0 组件至少覆盖：默认渲染、props 行为、事件触发、v-model 双向绑定。
- **类型**：`vue-tsc --noEmit` 全仓校验（含模板类型）。
- **Lint**：ESLint（`vue/vue3-recommended` + `typescript-eslint`）+ Prettier + stylelint；`pnpm lint` 一键执行。
- **提交规范**：Conventional Commits；根目录 `commitlint`（可选启用）。
- **CI（GitHub Actions）**：`pnpm install --frozen-lockfile` → `lint` → `typecheck` → `test` → `build` → `changeset status`（未含 changeset 的 PR 拦截提示）；main 分支合入后由 changesets action 开版本 PR，合入后 `pnpm -r publish`。
- **新增组件模板**：`packages/ui/src/components/` 下固定结构（`<Name>.vue`、`style.css`、`index.ts`、`__tests__/<Name>.spec.ts`），作为团队新增组件的标准范式。

---

## 9. 风险与开放问题

| 项 | 说明 | 处理 |
|---|---|---|
| 命名（占位） | `kb` / `@kb/ui` / `create-kb` / 组件前缀 `Kb` | 均为占位，批准后如不满意可全局替换（前缀、包名、CLI 名是独立的三个替换点） |
| 目录名 | 工作区名为中文"知识库" | 不影响 npm 包名与 git；如需发布到 GitHub 可建英文仓库名 |
| 首版范围 | P0 14 个组件 | 已收敛；若想更快落地可再砍（最低 8 个：Button/Input/Select/Checkbox/Radio/Switch/Table/Dialog） |
| 样式方案 | 原生 CSS + 变量 | 换取零构建依赖；若后续需要嵌套/混合等语法再评估 Sass |
| 发布凭据 | npm token、GitHub token | 发布前需用户在 CI secrets 配置；本地发布只需 npm 登录 |

---

## 10. 里程碑（实现阶段执行，本设计批准后另出实施计划）

1. **M0 工程底座**：pnpm workspace、根配置（tsconfig/eslint/prettier/stylelint）、Vitest 就绪。
2. **M1 组件库骨架**：token 体系 + Button/Icon 打样，确立组件模板范式与打包产物。
3. **M2 组件库 P0**：14 个 P0 组件全部实现 + 测试 + 样式。
4. **M3 演示与文档**：playground 接入、Vitepress 文档站上线组件页。
5. **M4 脚手架**：create-kb CLI + 两个模板。
6. **M5 发布链路**：changesets、CI、npm 发布，端到端验证 `pnpm create kb` → 新项目消费 `@kb/ui`。
