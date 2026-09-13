---
'kb-ui-vue': patch
---

补强可访问性、SSR 兼容与质量门禁。

**可访问性修复（axe-core 复现的真实缺陷）**

- `ContextMenu`：补齐 WAI-ARIA 菜单键盘导航（↑/↓ 移动焦点、Home/End 跳转首尾、Esc 关闭），菜单项 `tabindex="-1"`，并新增 `:focus-visible` 可见焦点样式；面板补 `aria-label`
- `Tour`：支持 Esc 关闭；气泡补 `aria-label`
- `ImagePreview` / `Splitter`：浮层与分隔条补 `aria-label`
- `TimePicker` / `TreeSelect`：combobox 补 `aria-label` 与 `aria-controls`（ARIA 1.2 要求），下拉面板补稳定 `id` 与名称
- 新增 `splitter` / `contextMenu` / `tour.label` / `image.previewDialog` / `timePicker.*` / `treeSelect.label` 等国际化词条（中英双语）

**新增测试**

- SSR 冒烟测试：node 环境下对全部组件执行 `renderToString`，拦截未做环境判断的 `window` / `document` 访问（71 例）
- a11y 测试：axe-core 规则校验 + 结构断言，覆盖 9 个组件（13 例）
- 覆盖率上报：新增 `pnpm test:coverage`（v8 provider）

**新增质量门禁**

- `pnpm check-size`：产物原始 / gzip 体积预算，并校验单组件引入的 tree-shaking 比例（当前约 3.6%）
- `pnpm test:visual`：重建视觉回归取样台。原用例依赖 playground 路由（该站并无路由，`/button` 等路径全部 404），实际从未跑通；现改为独立的确定性取样台，覆盖 18 个组件 × 3 套主题共 54 张基线
