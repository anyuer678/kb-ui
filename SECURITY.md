# 安全政策

## 支持范围

本项目以功能演示与学习交流为主要目的，**未按生产级标准验证**（详见 README 的免责声明）。尽管如此，我们仍然认真对待安全问题。

| 版本 | 是否接受安全报告 |
|---|---|
| `kb-ui-vue` 最新 minor | ✅ |
| 更早版本 | ❌（请先升级） |
| `@yuer678/kb-utils`、`@yuer678/kb-api`、`@yuer678/create-kb` | npm 已发布（维护者 `yuer678`），问题报告走本仓库 issues |

## 报告漏洞

**请不要用公开 issue 报告安全漏洞。**

请使用 GitHub 的私密漏洞报告通道：

> 仓库 → **Security** 标签 → **Report a vulnerability**

（也即 https://github.com/anyuer678/kb-ui/security/advisories/new ）

请在报告里尽量包含：

- 受影响的包与版本
- 复现步骤或最小复现仓库
- 影响范围（XSS / 原型污染 / 依赖投毒 / 拒绝服务…）
- 若有，请附上修复建议

## 我们承诺

- **3 个工作日内**确认收到报告
- **7 个工作日内**给出初步评估（是否成立、影响面、大致修复计划）
- 修复发布后，如果你愿意，会在 security advisory 里署名致谢

## 特别说明：组件的安全边界

以下几类问题属于**按设计如此**，不作为漏洞处理，但欢迎提 issue 讨论：

- 组件会把传入的 `string` 内容按 HTML 渲染的场景（如 `Tooltip` 的 `rawContent`、`Watermark` 的 `content`）——调用方需自行确保内容可信
- `kb-ui-vue` 自身**零运行时依赖**，但使用方的依赖树不在我们的控制范围内
- 参考后端 `@yuer678/kb-api` 使用内存数据与内置 CORS，本就只面向本地演示，**不可直接暴露到公网**


## 已知依赖告警台账（2026-09-25 复核）

主动披露当前 Dependabot open alerts 的来源、暴露面与处置决策。**全部为构建期依赖，不进入任何 npm 发布产物**——`kb-ui-vue` 的 runtime dependencies 为空（仅 peer `vue`），vite / esbuild / vitepress 只存在于开发与文档构建链路，组件产物零运行时依赖。

| 告警 | 实际来源 | 暴露面 | 上游状态 | 决策 |
|---|---|---|---|---|
| GHSA-fx2h-pf6j-xcff vite `server.fs.deny` bypass [high]；GHSA-v6wh-96g9-6wx3 launch-editor NTLMv2 hash disclosure [medium]；GHSA-4w7w-66w2-5vf9 vite deps `.map` path traversal [medium] | `docs/` 的 vitepress 1.6.4 → vite 5.4.21 | 仅本地 dev server（Windows 上运行 `docs:dev` 的开发者场景），文档站静态产物不受影响 | 修复需 vite ≥ 6.4.3，而 vitepress 稳定版止于 1.6.4（1.x 锁 vite ^5.4.14，2.x 截至 2026-09 仍为 alpha） | 等待 vitepress 2 stable 后一并升级；**不为清告警引入 alpha 依赖** |
| GHSA-67mh-4wv8-2f99 esbuild dev server 跨站读取 [medium] | 同上（vite 5.4 → esbuild 0.21.5） | 同上 | esbuild 0.25.0 已修复，但需 vite ≥ 6 配套 | 同上 |

不受影响项：`packages/ui` 的 vite ^8.3.0、根目录 esbuild ^0.28.1 均已高于全部漏洞区间。