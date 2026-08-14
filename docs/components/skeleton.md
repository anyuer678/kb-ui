# Skeleton 骨架屏

加载占位骨架，提供段落/标题/头像/图片等占位形态。

## 基础用法

```vue
<template>
  <KbSkeleton :rows="3" animated />
</template>
```

<KbSkeleton :rows="3" animated style="max-width: 420px" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `rows` | ``number`` | `3` | 段落行数 |
| `animated` | ``boolean`` | `false` | 是否开启动画 |
| `title` | ``boolean`` | `true` | 是否显示标题占位 |

