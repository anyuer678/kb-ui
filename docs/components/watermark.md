# Watermark 水印

页面/容器水印，支持文字与倾斜角度。

## 基础用法

```vue
<template>
  <KbWatermark content="机密"><div>内容区域</div></KbWatermark>
</template>
```

<KbWatermark content="KB UI"><div style="height: 120px; border: 1px dashed var(--kb-color-border); border-radius: 8px"></div></KbWatermark>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `content` | ``string`` | '' | 水印文字 |
| `rotate` | ``number`` | '-22' | 旋转角度 |
| `font-size` | ``number`` | `14` | 字号 |
| `z-index` | ``number`` | `9` | 层级 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 内容区域 |

