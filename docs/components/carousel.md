# Carousel 轮播图

图片/内容轮播，支持自动播放与指示器。

## 基础用法

```vue
<template>
  <KbCarousel :images="['/a.jpg']" />
</template>
```

<KbCarousel :images="['data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22160%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%233b82f6%22/><text x=%22150%22 y=%2285%22 fill=%22white%22 font-size=%2224%22>幻灯片 1</text></svg>', 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22160%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%2310b981%22/><text x=%22150%22 y=%2285%22 fill=%22white%22 font-size=%2224%22>幻灯片 2</text></svg>']" :height="160" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `images` | ``string[]`` | `[]` | 图片列表 |
| `height` | ``number`` | `200` | 高度 |
| `autoplay` | ``boolean`` | `true` | 自动播放 |
| `interval` | ``number`` | `3000` | 间隔 ms |

