# kb-ui-vue

> Vue 3 组件库：**73 组件 · 46 套主题（CSS 变量驱动）· 按需引入 · 零运行时依赖**。

[kb-ui](https://github.com/anyuer678/kb-ui) monorepo 的组件库包。样式全部原生 CSS + 设计 token（无第三方样式框架），构建产物 ESM + CJS 双格式，每个组件独立 `style.css` 可单独引入。

## 安装

```bash
npm i kb-ui-vue
```

```ts
import { createApp } from 'vue'
import { KbButton, KbInput, KbTable } from 'kb-ui-vue'
import 'kb-ui-vue/styles/kb-button.css' // 组件样式按需引入
```

## 特性

- **73 组件**：基础 / 表单 / 反馈 / 数据 / 图片 / 滚动与浮层全覆盖（Table、Tree、Cascader、DatePicker、Tour、VirtualList、QRCode 等）
- **46 套主题**：12 套颜色主题 + 36 套风格主题（圆润/扁平/玻璃/赛博/水墨/孟菲斯…），`[data-theme]` CSS 变量一行切换，支持深色模式
- **全局配置**：`ConfigProvider` 统一注入 `locale` / `size` / `zIndex` / `theme`；内置 `zh-CN` / `en-US` 语言包
- **按需引入**：`kb-ui-vue/resolver` 导出 `KbResolver`，配合 `unplugin-vue-components` 自动引入组件与样式
- **IDE 类型**：`dist/global.d.ts` 提供模板中 `<KbXxx>` 全量补全
- **函数式 API**：`message` / `notification` 命令式调用开箱即用
- **质量**：606 例单测（含 SSR 冒烟 + axe 可访问性）、覆盖率门禁、体积预算、视觉回归基线

## 相关包

- [`@yuer678/kb-utils`](https://www.npmjs.com/package/@yuer678/kb-utils) —— 通用 TS 工具函数库（60+ 函数）
- [`@yuer678/kb-api`](https://www.npmjs.com/package/@yuer678/kb-api) —— 可复用的参考后端（Express + Zod）
- [`@yuer678/create-kb`](https://www.npmjs.com/package/@yuer678/create-kb) —— 项目脚手架（7 种模板）
- 在线文档（组件 API 与真实示例）：<https://anyuer678.github.io/kb-ui/>
- 仓库：<https://github.com/anyuer678/kb-ui>

## License

MIT
