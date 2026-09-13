# Image 图片

在原生 `<img>` 之上补齐加载失败兜底与点击预览。

## 基础用法

```vue
<template>
  <KbImage src="/logo.png" width="200" alt="Logo" />
</template>
```

<div style="display:flex;gap:16px;align-items:flex-start">
  <KbImage :src="demo" :width="200" alt="示例" />
  <KbImage :src="demo" :width="200" fit="contain" style="background:#f5f7fa" alt="contain" />
</div>

## 加载失败

`src` 请求失败时改用 `fallback`，并可自定义 `error` 插槽。

```vue
<template>
  <KbImage src="/not-exist.png" fallback="/placeholder.png" width="200">
    <template #error>图片走丢了</template>
  </KbImage>
</template>
```

## 关闭预览

`preview=false` 时不显示遮罩，也不会挂载预览组件。

```vue
<template>
  <KbImage :src="demo" :preview="false" width="200" />
</template>
```

<KbImage :src="demo" :preview="false" :width="200" />

## 多图预览

传 `preview-list` 后可在预览层里左右切换，点击时定位到当前图。

```vue
<template>
  <KbImage :src="a" :preview-list="[a, b, c]" width="200" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `src` | `string` | — | 图片地址 |
| `alt` | `string` | `''` | 替代文本 |
| `width` | `string \| number` | — | 宽度，数字按 px |
| `height` | `string \| number` | — | 高度，数字按 px |
| `preview` | `boolean` | `true` | 是否允许点击预览 |
| `previewList` | `string[]` | — | 预览图列表，默认只预览当前图 |
| `fit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'fill'` | 填充方式 |
| `fallback` | `string` | — | 加载失败替代图 |

### 插槽

| 插槽 | 说明 |
|---|---|
| `error` | 加载失败时的内容 |
| `mask` | 预览遮罩内容 |

<script setup>
const svg = (fill, text) =>
  `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22240%22%20height=%22160%22%3E%3Crect%20width=%22240%22%20height=%22160%22%20fill=%22${fill}%22/%3E%3Ctext%20x=%22120%22%20y=%2292%22%20fill=%22white%22%20font-size=%2236%22%20text-anchor=%22middle%22%3E${text}%3C/text%3E%3C/svg%3E`
const demo = svg('%23409eff', 'IMG')
const a = svg('%23409eff', 'A')
const b = svg('%2300b578', 'B')
const c = svg('%23f5a623', 'C')
</script>
