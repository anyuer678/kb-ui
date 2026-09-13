---
'kb-ui-vue': minor
---

新增 ConfigProvider 全局配置组件与国际化体系。

**ConfigProvider**

- 提供统一的 `locale` / `size` / `zIndex` / `theme` 配置，透传 slot、不产生额外 DOM
- `theme="dark"` 会把 `data-theme="dark"` 同步到 `<html>`，配合内置 `dark.css` 生效
- 配置通过 `reactive` 注入，运行时切换语言或尺寸会立即作用于整棵子树
- 配套导出 `useGlobalConfig` / `useLocale` / `useSize` / `useZIndex`

**国际化**

- 内置 `zh-CN` 与 `en-US` 语言包，导出 `locales` / `getLocale` / `zhCN` / `enUS`
- 把 15 个组件里硬编码的中文文案与无障碍标注（`aria-label`）全部抽到语言包：
  Calendar、Carousel、Cascader、ColorPicker、DatePicker、Dialog、Empty、Form、
  InputPassword、List、Pagination、Popconfirm、Search、Table、Transfer、Upload
- 取值优先级为「显式 prop > 语言包 > 默认语言包」，未传 prop 时行为与之前一致，
  已有代码无需改动；自定义语言包缺字段会自动回退，不必抄全量

**其他**

- 文档站版本号改为从 `packages/ui/package.json` 读取，避免与发布版本脱节
