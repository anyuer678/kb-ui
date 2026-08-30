# KB UI

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220)](https://pnpm.io/)
[![组件](https://img.shields.io/badge/组件-55+-10b981)](https://github.com/anyuer678/kb-ui)
[![主题](https://img.shields.io/badge/主题-46-8b5cf6)](https://github.com/anyuer678/kb-ui)
[![模块模板](https://img.shields.io/badge/模块模板-36+-f59e0b)](https://github.com/anyuer678/kb-ui)

**一套自建的前端素材库与工程模板集**：Vue 3 组件库 + 36 个完整页面模块 + 46 套多风格主题 + 通用工具函数 + 7 种项目脚手架模板 + DevOps 资产，全部零运行时依赖、CSS 变量驱动。

> ⚠️ 项目当前为**私有仓库**，组件库尚未发布到 npm（开发调试请使用 `file:` 链接或 workspace）。

---

## 功能特性

### 组件库（@kb/ui，55+ 组件）
- **覆盖常用场景**：基础（Button/Icon/Tag/Space/Divider/Grid）、表单（Input/Select/Checkbox/Radio/Switch/Form/DatePicker/Upload/Tree/Cascader/Transfer…）、反馈（Dialog/Drawer/Message/Notification/Tooltip/Popover/Popconfirm…）、数据（Table/Calendar/Statistic/Descriptions/Timeline/Carousel…）
- **函数式 API**：`message` / `notification` 命令式调用，开箱即用
- **按需样式**：每个组件独立 `style.css`，构建产物 `dist/styles/*` 可单独引入
- **零运行时依赖**：样式全部原生 CSS + 设计 token，无第三方样式框架

#### 组件实现深度标注

| 深度 | 组件 |
|------|------|
| ✅ 基础 | Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Checkbox, Collapse, ColorPicker, CountUp, Descriptions, Dialog, Divider, Drawer, Dropdown, Empty, Icon, Input, InputNumber, InputPassword, List, Loading, Message, Notification, Pagination, Popconfirm, Popover, Progress, Radio, Rate, Result, Search, Segmented, Skeleton, Slider, Space, Statistic, Steps, Switch, Tag, Textarea, Tooltip, Upload, Watermark |
| 🔧 进阶 | Form（校验+动态字段）, Grid（响应式布局）, Select（搜索+键盘导航）, Tabs, Timeline |
| 📋 演示级 | Cascader（嵌套选择可用，缺异步加载）, DatePicker（基础日期选择，缺范围/多选）, Table（仅展示，无排序/分页/固定列）, Transfer（双列表迁移，缺搜索/分页）, Tree（基础树形，缺拖拽/虚拟滚动） |

### 主题系统（46 套）
- **双维度切换**：12 套颜色主题（violet/teal/rose/ink/neon…）+ 36 套风格主题（圆润/扁平/渐变/玻璃/赛博/终端/水墨/商务/孟菲斯/波普/极简/粉彩/鎏金/丹青…）
- **CSS 变量驱动**：每个主题一个 `[data-theme]` 覆盖文件，运行时一行代码切换
- **深色模式**：`[data-theme]` + `.dark` 组合，自动适配

### 页面模块模板（36 个）
登录 / 注册 / 仪表盘 / 数据大屏 / 任务看板 / 数据分析 / 订单管理 / 用户管理 / 邮件收件箱 / 文件管理 / 博客文章 / 聊天窗口 / 音乐播放器 / 购物结算 / 价格页 / 分步向导 / 图片画廊 / 个人简历 / 宠物商店 / 视频列表 / 落地页 …（playground 内全部可切换预览）

### 通用工具库（@kb/utils，60+ 函数）
格式化（日期/数字/文件大小/时长/金额）、数组、对象（深拷贝/深合并）、字符串、正则校验、并发控制（pLimit/retry）、防抖节流、存储封装、DOM 工具

### 脚手架模板（create-kb，7 种）
| 模板 | 说明 |
|------|------|
| `base` | 最小可用 Vue 3 + Vite + TS 前端 |
| `starter` | 带完整组件示例的前端 |
| `api` | Express + TypeScript + Zod 后端（含 supertest 测试） |
| `fullstack` | Vue 前端 + Express API + Docker Compose 一键起 |
| `electron` | Electron 桌面应用骨架（安全模型 + 打包） |
| `react` | React 19 + Vite 前端 |
| `ai` | LLM 工作台（OpenAI 兼容 + SSE 流式 + 聊天前端） |

### DevOps 资产
CI（lint/typecheck/test/build）、changesets 自动发布、多服务 docker-compose、Node 多阶段 Dockerfile、部署检查清单（见 `docs/devops-模板.md`）

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3.5 + TypeScript 5.9 |
| 构建 | Vite 8（lib mode）+ tsup |
| 包管理 | pnpm 10 workspace monorepo |
| 测试 | Vitest（239 例单测）+ Playwright（e2e 19 项） |
| 文档 | Vitepress 1.6 |
| 版本管理 | changesets |

## 快速开始

```bash
pnpm install       # 安装全部依赖
pnpm start         # 一键启动 playground(:8070) + docs(:8071)
```

- **playground** http://localhost:8070 —— 46 主题切换 + 36 模块预览
- **docs** http://localhost:8071 —— 组件文档（56 页，含 API 表格与真实示例）

### 用 create-kb 创建项目

```bash
pnpm create kb my-app                 # 交互式选择模板
pnpm create kb my-api --template api  # 直接指定模板（7 选 1）
```

## 项目结构

```
kb-ui/
├── packages/
│   ├── ui/            # @kb/ui 组件库（55+ 组件）
│   ├── utils/         # @kb/utils 工具函数库
│   ├── config/        # 共享工程配置（tsconfig/eslint/prettier/stylelint）
│   └── create-kb/     # 脚手架 CLI（7 种模板）
├── playground/        # 组件演示站（源码直连热更新）
├── docs/              # Vitepress 文档站 + DevOps 模板
├── scripts/           # 构建/文档生成/e2e 脚本
└── internal-docs/     # 设计文档与实施计划（内部）
```

## 常用命令

```bash
pnpm start            # 一键启动全部开发环境（playground + docs）
pnpm lint             # 全部包 lint
pnpm typecheck        # 全部包类型检查
pnpm test             # 全部包单元测试
pnpm build            # 全部包构建（dist/styles 100 个样式文件）
pnpm e2e              # 端到端测试（playground + docs）
pnpm docs:build       # 构建文档站
```

## 版本与发布

- 组件库与脚手架通过 [changesets](https://github.com/changesets/changesets) 管理版本与 changelog
- 流程：`pnpm changeset` → 推代码 → CI 自动创建「版本 PR」→ 合并后自动发布
- 首次发布前需在 GitHub Secrets 配置 `NPM_TOKEN`

## 文档

- [组件文档站](https://anyuer678.github.io/kb-ui/)（部署后生效）
- `docs/` 下含组件 API、主题定制指南、DevOps 模板
- `internal-docs/` 下含设计文档（specs）与实施计划（plans）

## 免责声明

本项目按 **MIT** 协议以「现状」（AS IS）提供，作者与贡献者**不对使用本项目产生的任何直接、间接、偶然或后果性损失负责**。本项目以功能演示与学习交流为主要目的，架构设计、安全基线、容错机制与性能表现均未按生产级标准验证，**不适用于实际生产环境或关键业务场景**。任何部署于生产系统、对外提供服务或接入真实业务工作流的做法，均属使用者的自主决策行为，由此产生的任何不良后果，作者均不承担任何责任。

## License

[GNU General Public License v3.0](LICENSE) — Copyright (C) 2026 anyuer678

### 协议要点

- ✅ 自由使用、修改、分发
- ✅ MIT 许可证：允许自由使用、修改与分发（保留版权声明即可）
- ❌ 禁止闭源商业化
