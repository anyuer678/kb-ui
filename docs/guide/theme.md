# 主题定制

KB UI 的全部视觉样式都由 CSS 变量（设计 token）驱动，前缀为 `--kb-`。

## 变量一览

```css
/* 品牌色 */
--kb-color-primary: #3b82f6;
--kb-color-success: #16a34a;
--kb-color-warning: #f59e0b;
--kb-color-danger: #dc2626;
--kb-color-info: #64748b;

/* 中性色 */
--kb-color-bg: #fff;
--kb-color-bg-elevated: #f8fafc;
--kb-color-border: #e2e8f0;
--kb-color-text-1: #0f172a;
--kb-color-text-2: #475569;
--kb-color-text-3: #94a3b8;

/* 圆角 / 阴影 / 字体 / 间距 / 过渡 / 层级 */
--kb-radius-sm: 4px;
--kb-radius-md: 6px;
--kb-radius-lg: 10px;
--kb-radius-round: 999px;
--kb-shadow-1: 0 1px 2px rgb(0 0 0 / 5%);
--kb-shadow-2: 0 4px 12px rgb(0 0 0 / 8%);
--kb-font-family: -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
--kb-font-size-xs: 12px;
--kb-font-size-sm: 13px;
--kb-font-size-md: 14px;
--kb-font-size-lg: 16px;
--kb-font-size-xl: 20px;
--kb-space-1: 4px;
--kb-space-2: 8px;
--kb-space-3: 12px;
--kb-space-4: 16px;
--kb-space-5: 20px;
--kb-space-6: 24px;
--kb-transition-duration: 0.2s;
--kb-transition-timing: ease;
--kb-z-index-message: 2000;
--kb-z-index-modal: 1000;
```

## 定制品牌色

在引入组件库样式**之后**覆盖变量即可：

```css
:root {
  --kb-color-primary: #7c3aed;
}
```

## 暗色主题

设置 `data-theme="dark"` 后，`--kb-color-*` 中性色会被自动覆盖为暗色值。

```html
<html data-theme="dark">
```
