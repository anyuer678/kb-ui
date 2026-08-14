# Timeline 时间线

垂直时间线展示事件流，支持状态色。

## 基础用法

```vue
<template>
  <KbTimeline :items="[{ content: '事件', time: '5 分钟前' }]" />
</template>
```

<KbTimeline :items="[{ content: '发布 v1.0', time: '2026-08-08', type: 'success' }, { content: '设计评审', time: '2026-08-10' }, { content: '计划 v2.0', time: '2026-09', type: 'warning' }]" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``TimelineItem[]`` | `[]` | 事件项（content/time/type） |

