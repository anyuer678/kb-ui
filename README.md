# KB UI

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220)](https://pnpm.io/)
[![组件](https://img.shields.io/badge/组件-55+-10b981)](https://github.com/anyuer678/kb-ui)
[![主题](https://img.shields.io/badge/主题-46-8b5cf6)](https://github.com/anyuer678/kb-ui)
[![模块模板](https://img.shields.io/badge/模块模板-36+-f59e0b)](https://github.com/anyuer678/kb-ui)

**一套自建的前端素材库与工程模板集**：Vue 3 组件库 + 36 个完整页面模块 + 46 套多风格主题 + 通用工具函数（含 HTTP 请求层）+ 可复用的参考后端 + 7 种项目脚手架模板 + DevOps 资产，全部零运行时依赖、CSS 变量驱动。

> 📦 组件库已发布到 npm：[`kb-ui-vue`](https://www.npmjs.com/package/kb-ui-vue)（`npm i kb-ui-vue`）。`@kb/utils`、`@kb/api` 与脚手架包尚未发布（开发调试请使用 `file:` 链接或 workspace）——它们已加入 `.changeset/config.json` 的 `ignore`，待 `@kb` 作用域归属确认、`create-kb` 包名冲突解决后再发。

---

## 功能特性

### 组件库（`kb-ui-vue`，55+ 组件）
- **覆盖常用场景**：基础（Button/Icon/Tag/Space/Divider/Grid）、表单（Input/Select/Checkbox/Radio/Switch/Form/DatePicker/Upload/Tree/Cascader/Transfer…）、反馈（Dialog/Drawer/Message/Notification/Tooltip/Popover/Popconfirm…）、数据（Table/Calendar/Statistic/Descriptions/Timeline/Carousel…）
- **函数式 API**：`message` / `notification` 命令式调用，开箱即用
- **按需样式**：每个组件独立 `style.css`，构建产物 `dist/styles/*` 可单独引入
- **零运行时依赖**：样式全部原生 CSS + 设计 token，无第三方样式框架

#### 组件实现深度标注

| 深度 | 组件 |
|------|------|
| ✅ 基础 | Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Checkbox, Collapse, ColorPicker, CountUp, Descriptions, Dialog, Divider, Drawer, Dropdown, Empty, Icon, Input, InputNumber, InputPassword, List, Loading, Message, Notification, Pagination, Popconfirm, Popover, Progress, Radio, Rate, Result, Search, Segmented, Skeleton, Slider, Space, Statistic, Steps, Switch, Tag, Textarea, Tooltip, Upload, Watermark |
| 🔧 进阶 | Cascader（异步加载/清空）, DatePicker（单日期/范围/多选）, Form（校验+动态字段）, Grid（响应式布局）, Select（搜索+键盘导航）, Table（排序/分页/固定列/行选择/服务端分页）, Transfer（搜索/分页/全选）, Tree（虚拟滚动/拖拽排序）, Tabs, Timeline |

### 主题系统（46 套）
- **双维度切换**：12 套颜色主题（violet/teal/rose/ink/neon…）+ 36 套风格主题（圆润/扁平/渐变/玻璃/赛博/终端/水墨/商务/孟菲斯/波普/极简/粉彩/鎏金/丹青…）
- **CSS 变量驱动**：每个主题一个 `[data-theme]` 覆盖文件，运行时一行代码切换
- **深色模式**：`[data-theme]` + `.dark` 组合，自动适配

### 页面模块模板（36 个）
登录 / 注册 / 仪表盘 / 数据大屏 / 任务看板 / 数据分析 / 订单管理 / 用户管理 / 邮件收件箱 / 文件管理 / 博客文章 / 聊天窗口 / 音乐播放器 / 购物结算 / 价格页 / 分步向导 / 图片画廊 / 个人简历 / 宠物商店 / 视频列表 / 落地页 …（playground 内全部可切换预览）

### 通用工具库（`@kb/utils`，60+ 函数）
格式化（日期/数字/文件大小/时长/金额）、数组、对象（深拷贝/深合并）、字符串、正则校验、并发控制（pLimit/retry）、防抖节流、存储封装、DOM 工具、**HTTP 请求层**（`createHttp`：baseURL / 参数拼接 / 超时 / 请求响应钩子 / 指数退避重试）

### 参考后端（`@kb/api`）
一个可直接 `import` 的 Express 5 + Zod 4 后端，同时充当组件演示的数据源与脚手架模板的后端底座：

- **开箱即用**：`createApp()` 返回可挂载的 Express 应用，`startServer()` 一键起服务（默认 `127.0.0.1:8082`）
- **内置接口**：`/health`（含无前缀探活）、`/api/users`（分页 + 排序 + 搜索，字段与排序键白名单）、`/api/regions`（树形 + `parent` 懒加载）、`/api/regions/tree`、`/api/options`
- **中间件**：统一错误处理（`HttpError` / `notFoundHandler` / `errorHandler`）、Zod 校验中间件 `validate(schema)`、内置 CORS
- **数据层可替换**：`src/data/*` 为确定性内存数据（500 用户 / 440 区域节点 / 240 候选项），路由只依赖访问器，换数据库只需替换这一层
- **与脚手架同源**：`create-kb` 的 `api` 与 `fullstack` 模板后端由 `pnpm sync:api-template` 从本包同步，不存在第二份实现

```bash
pnpm api        # 起本地后端（tsx watch，默认 :8082）
```

### 脚手架模板（create-kb，7 种）
| 模板 | 说明 |
|------|------|
| `base` | 最小可用 Vue 3 + Vite + TS 前端 |
| `starter` | 带完整组件示例的前端 |
| `api` | Express + TypeScript + Zod 后端（源码与 `@kb/api` 同步，含 21 例 supertest 测试） |
| `fullstack` | Vue 前端 + Express API + Docker Compose 一键起（后端同样与 `@kb/api` 同步） |
| `electron` | Electron 桌面应用骨架（安全模型 + 打包） |
| `react` | React 19 + Vite 前端 |
| `ai` | LLM 工作台（OpenAI 兼容 + SSE 流式 + 聊天前端） |

### DevOps 资产
CI（lint / typecheck / test / build / 模板一致性校验，见 `.github/workflows/ci.yml`）、GitHub Pages 文档部署、changesets 自动发布、Node 多阶段 Dockerfile 与多服务 docker-compose（在 `fullstack` 模板内）、部署检查清单（见 `docs/devops-模板.md`）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3.5 + TypeScript 5.9 |
| 后端 | Express 5 + Zod 4（`@kb/api`） |
| 构建 | Vite 8（lib mode）+ tsup |
| 包管理 | pnpm 10 workspace monorepo |
| 测试 | Vitest（300+ 例单测）+ Playwright（e2e） |
| 文档 | Vitepress 1.6 |
| 版本管理 | changesets |

## 快速开始

```bash
pnpm install       # 安装全部依赖
pnpm start         # 启动 playground(:8070) + docs(:8071)
pnpm start:full    # 再额外拉起本地后端 @kb/api(:8082)，playground 的「真实接口」示例即可用
```

- **playground** http://localhost:8070 —— 46 主题切换 + 36 模块预览 + 真实接口联调示例
- **docs** http://localhost:8071 —— 组件文档（含 API 表格与真实示例）
- **api** http://localhost:8082/api —— 参考后端（`pnpm api` 单独启动）

### 用 create-kb 创建项目

> ⚠️ npm 上的 `create-kb` 是**同名无关项目**（来源 `adamBoualleiguie/knowledge-base`，维护者 `kb-base`）。
> 直接跑 `pnpm create kb my-app` 会拉到那个包，而不是本仓库的脚手架。
> 脚手架尚未发布，请在本仓库内以本地方式使用：

```bash
pnpm --filter create-kb build                       # 先构建 CLI
node packages/create-kb/dist/index.js my-app        # 交互式选择模板
node packages/create-kb/dist/index.js my-api --template api   # 直接指定模板（7 选 1）
```

### 修改后端源码后请同步模板

```bash
pnpm sync:api-template          # 把 packages/api 的源码同步进 create-kb 的 api / fullstack 模板
pnpm sync:api-template:check    # 只校验是否漂移（CI 会跑这一步）
```

## 项目结构

```
kb-ui/
├── packages/
│   ├── ui/            # kb-ui-vue 组件库（55+ 组件）
│   ├── utils/         # @kb/utils 工具函数库（含 HTTP 请求层）
│   ├── api/           # @kb/api 参考后端（Express + Zod）
│   ├── config/        # 共享工程配置（tsconfig/eslint/prettier/stylelint）
│   └── create-kb/     # 脚手架 CLI（7 种模板，后端模板由 sync 脚本生成）
├── playground/        # 组件演示站（源码直连热更新，含真实接口示例）
├── docs/              # Vitepress 文档站 + DevOps 模板
├── scripts/           # 构建/文档生成/模板同步/e2e 脚本
└── internal-docs/     # 设计文档与实施计划（内部）
```

## 常用命令

```bash
pnpm start            # 启动 playground + docs
pnpm start:full       # 再拉起本地后端（playground 真实接口示例需要）
pnpm api              # 只起参考后端
pnpm lint             # 全部包 lint
pnpm typecheck        # 全部包类型检查
pnpm test             # 全部包单元测试
pnpm build            # 全部包构建（dist/styles 100 个样式文件）
pnpm e2e              # 端到端测试（playground + docs）
pnpm docs:build       # 构建文档站
pnpm sync:api-template        # 同步 create-kb 后端模板
pnpm sync:api-template:check  # 校验模板与 packages/api 是否一致
```

## 版本与发布

- 组件库与脚手架通过 [changesets](https://github.com/changesets/changesets) 管理版本与 changelog
- 流程：`pnpm changeset` → 推代码 → CI 跑校验 → 打 tag / 合并后由 `release.yml` 发布
- 首次发布前需在 GitHub Secrets 配置 `NPM_TOKEN`；未配置时发布任务会安全跳过

## 文档

- [组件文档站](https://anyuer678.github.io/kb-ui/)（部署后生效）
- `docs/` 下含组件 API、主题定制指南、后端模块说明、DevOps 模板
- `internal-docs/` 下含设计文档（specs）与实施计划（plans）

## 免责声明

本项目按 **MIT** 协议以「现状」（AS IS）提供，作者与贡献者**不对使用本项目产生的任何直接、间接、偶然或后果性损失负责**。本项目以功能演示与学习交流为主要目的，架构设计、安全基线、容错机制与性能表现均未按生产级标准验证，**不适用于实际生产环境或关键业务场景**。任何部署于生产系统、对外提供服务或接入真实业务工作流的做法，均属使用者的自主决策行为，由此产生的任何不良后果，作者均不承担任何责任。

## License

[MIT License](LICENSE) — Copyright (c) 2026 anyuer678

### 协议要点

- ✅ 自由使用、修改、分发（保留版权声明与许可声明即可）
- ✅ 可用于商业项目
- ℹ️ 本项目按「现状」（AS IS）提供，作者不承担担保与责任（见上方免责声明）
