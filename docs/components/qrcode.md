# QRCode 二维码

生成符合 ISO/IEC 18004 标准的二维码，以 SVG 渲染（单个 `<path>`，任意缩放不失真）。编码器为库内自研实现，零运行时依赖。

## 基础用法

```vue
<template>
  <KbQRCode value="https://kb-ui.dev" />
</template>
```

<KbQRCode value="https://kb-ui.dev" />

## 尺寸与纠错等级

`size` 为渲染像素尺寸（含静默区）；`level` 为错误校正等级，越高容错越强但容量越小。

```vue
<KbQRCode value="https://kb-ui.dev" :size="120" level="H" />
```

<KbQRCode value="https://kb-ui.dev" :size="120" level="H" style="margin-left:24px" />

## 自定义颜色

<KbQRCode value="https://kb-ui.dev" color="#10b981" style="margin-right:24px" />
<KbQRCode value="https://kb-ui.dev" color="#0f172a" bg-color="#f1f5f9" />

## 默认插槽

默认插槽用于在二维码中心叠加图标/文字（叠加区域依赖较高纠错等级，建议配合 `level="H"`）。

```vue
<KbQRCode value="https://kb-ui.dev" level="H">
  <span class="logo">LOGO</span>
</KbQRCode>
```

## 实现说明

- 支持 数字 / 字母数字 / 字节 三种编码模式与 L / M / Q / H 四级纠错
- 自动选择最小可容纳版本（1–40），并按规范罚分规则从 8 种掩码中自动优选
- 内置 GF(256) 运算与 Reed-Solomon 纠错码，分块交织符合 ISO/IEC 18004
- 无障碍：`role="img"` + `alt`（默认等于 `value`）

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `value` | `string` | — | 编码内容（文本 / URL） |
| `size` | `number` | `160` | 渲染像素尺寸（含静默区） |
| `level` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | 错误校正等级 |
| `margin` | `number` | `4` | 静默区模块数（规范要求 ≥4） |
| `color` | `string` | `'#000000'` | 暗模块颜色 |
| `bgColor` | `string` | `'#FFFFFF'` | 背景（亮模块）颜色 |
| `alt` | `string` | 等于 `value` | 无障碍替代文本 |

### 插槽

| 插槽 | 说明 |
|---|---|
| 默认 | 叠加在二维码中心的图标/文字 |
