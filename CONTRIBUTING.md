# 贡献指南

感谢你愿意为 KB UI 出力。这个仓库既是组件库，也是一套前端素材库（主题 / 页面模块 / 工具函数 / 参考后端 / 脚手架），所以「改哪一块」的流程略有不同，下面分开说。

## 环境要求

| 项 | 版本 |
|---|---|
| Node | `>=20`（CI 跑 22） |
| pnpm | `10.x`（仓库固定 `packageManager: pnpm@10.0.0`） |

```bash
pnpm install       # 安装全部工作区依赖
pnpm start         # playground(:8070) + docs(:8071)
pnpm start:full    # 再额外拉起参考后端 @kb/api(:8082)
```

> 如果 `pnpm install` 长时间没有任何输出，多半是被 `~/.npmrc` 里的本地代理挂住了，见下方「常见卡点」。

## 目录约定

```
packages/ui/        kb-ui-vue 组件库（发布到 npm 的就是这个包）
packages/utils/     @kb/utils 工具函数
packages/api/       @kb/api 参考后端（Express + Zod）
packages/config/    共享工程配置（tsconfig / eslint / stylelint）
packages/create-kb/ 脚手架 CLI
playground/         组件与页面模块演示站（Vite，源码直连热更新）
docs/               VitePress 文档站
scripts/            构建 / 文档生成 / 模板同步 / e2e 脚本
internal-docs/      设计文档与实施计划（内部）
```

## 提交前必须跑的四件事

CI（`.github/workflows/ci.yml`）会依次执行 `build → lint → typecheck → test → 模板一致性 → audit → changeset status`。**本地至少要跑齐前四项**，否则推上去必红：

```bash
pnpm build        # 注意：必须能构建，CI 会先构建再 lint
pnpm lint
pnpm typecheck
pnpm test
```

单独跑某个包更快：

```bash
pnpm --filter kb-ui-vue test
cd packages/ui && npx vue-tsc --noEmit
```

> ⚠️ **只改 CSS 也必须跑 `pnpm lint`。** stylelint 的 `no-descending-specificity` 很容易被触发：低特异性选择器（如 `:focus-visible`，0,2,0）不能写在高特异性选择器（如 `.x--dragging > .y:active`，0,3,0）**之后**，把低特异性的往上挪即可。

## 新增一个组件

`packages/ui/src/components/<Name>/` 下需要这些文件，缺一个都不完整：

```
<Name>/
├── <Name>.vue              # 实现（<script setup lang="ts">）
├── style.css               # 组件样式，只用 tokens 里的 CSS 变量
├── index.ts                # export { default as Kb<Name> } from './<Name>.vue'
└── __tests__/<Name>.spec.ts
```

然后还要注册到两个地方，否则按需引入和类型提示会漏掉它：

1. `packages/ui/src/index.ts` —— `export *`、`Kb` 前缀别名、`components` 数组、plugin `install` 列表
2. `packages/ui/src/resolver-map.ts` —— 加进 `SAME_NAME_ENTRIES`（若样式与其他组件共用，则加进 `ALIASED_ENTRIES`；无独立样式的加进 `STYLELESS_ENTRIES`）

再补一个 `docs/components/<kebab-name>.md`，并在 `docs/.vitepress/config.ts` 的侧边栏挂上。文档页里请写**真实可运行的示例**（直接写 `<KbXxx>` 标签，VitePress 会自动注册整个组件库）。

最后加一个 changeset（见下）。

### 组件实现的几条约定

- **零运行时依赖**：不要引入第三方样式框架或运行时工具库，样式一律走 `--kb-*` 设计 token
- **文案不要硬编码**：需要显示文案时用 `useLocale()` 的 `t('path')`，并同步补 `src/locale/types.ts`、`zh-CN.ts`、`en-US.ts` 三个文件
- **尺寸 / z-index**：从 `useGlobalConfig()` 取 `size`、`useZIndex()` 取层级，不要写死
- **DOM 访问要守卫**：`window` / `document` 必须在 `onMounted` 内或加 `typeof window !== 'undefined'` 判断，否则 SSR 会崩
- **可访问性**：交互组件要有 `aria-*`、键盘可达（Enter / Space / Esc / 方向键）、可见焦点样式

## Changeset（必填）

任何影响发布包的改动都要带一个 changeset，否则 CI 的 `changeset status` 会失败：

```bash
pnpm changeset          # 交互式选择受影响的包与版本档位
```

- 说人话写变更说明，它是 CHANGELOG 的正文
- `minor`：新增组件、新增能力；`patch`：修复、文档、内部调整
- `@kb/utils`、`@kb/api`、`create-kb` 目前在 `.changeset/config.json` 的 `ignore` 里，暂不参与发布

## 提交信息

用 Conventional Commits 的语义化前缀，描述用中文：

```
feat(ui): 新增 Splitter 组件
fix(table): 修正固定列在横向滚动时的错位
style(splitter): 修正分隔条选择器顺序以通过 stylelint
docs: 补充按需引入说明
chore: 升级 vite 到 8.2
```

## 发版流程

发版是**手动**触发的，不会随合并自动进行（避免不可逆的外部动作被顺带触发）：

1. PR 合并前带好 changeset，合并进 `master`
2. 手动触发 `.github/workflows/release.yml`（可先选 `dry_run` 演练）
3. 需要 `NPM_TOKEN`（带 publish 权限的 npm Automation token）；未配置时发布任务安全跳过

细节与排障见 [`internal-docs/releasing.md`](internal-docs/releasing.md)。

## 修改参考后端后要同步模板

`packages/api` 是 `create-kb` 里 `api` / `fullstack` 模板后端的唯一来源，改完必须同步，否则 CI 会红：

```bash
pnpm sync:api-template          # 同步
pnpm sync:api-template:check    # 只校验
```

## 常见卡点

| 现象 | 原因与处理 |
|---|---|
| `pnpm install` 长时间零输出 | `~/.npmrc` 里的本地代理（`http://127.0.0.1:7890`）会挂住 pnpm。用 `pnpm install --config.proxy= --config.https-proxy= < /dev/null` 绕过 |
| `Cannot find module ...` / `Failed to resolve vue/compiler-sfc` | 上次中断的 install 留下了**截断的包**（目录在、入口文件缺）。删掉 `node_modules/.modules.yaml` 让它重新链接，或 `pnpm install --force` |
| `vite build` 卡在 `... modules transformed` 不动 | 死锁，不是慢。删掉 `packages/ui/dist` 再重跑（判断依据：node 进程 CPU 几分钟不涨） |
| CI 报 `--frozen-lockfile` 失败 | 改过任何 `package.json` 就必须把更新后的 `pnpm-lock.yaml` 一起提交 |
| 分支名带 `/` 后一切异常 | 本机 git 建不出 `.git/refs/remotes/origin/` 嵌套目录。改用连字符分支名，并用 `git log --oneline -1` 确认不是 unborn HEAD |

## 协议

提交贡献即表示你同意以本仓库的 [MIT License](LICENSE) 授权你的贡献。
