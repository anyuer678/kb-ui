# Anchor 锚点

根据页面滚动位置高亮当前锚点，点击可平滑跳转。

## 基础用法

```vue
<template>
  <KbAnchor :items="items" :offset-top="60" />
</template>

<script setup>
const items = [
  { title: '基础用法', href: '#anchor-basic' },
  {
    title: '嵌套锚点',
    href: '#anchor-nested',
    children: [{ title: '子项', href: '#anchor-sub' }],
  },
]
</script>
```

<KbAnchor
  :items="[
    { title: '基础用法', href: '#anchor-basic' },
    { title: '嵌套锚点', href: '#anchor-nested', children: [{ title: '子项', href: '#anchor-sub' }] },
  ]"
/>

## 嵌套锚点

`items` 支持一级 `children`，子项同样参与高亮计算与点击跳转。

```vue
<template>
  <KbAnchor :items="items" />
</template>

<script setup>
const items = [
  { title: '章节一', href: '#s1', children: [{ title: '小节 1.1', href: '#s1-1' }] },
  { title: '章节二', href: '#s2' },
]
</script>
```

## 关闭平滑滚动

```vue
<template>
  <KbAnchor :items="items" :smooth="false" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | `AnchorItem[]` | `[]` | 锚点数据，支持 `children` 嵌套一层 |
| `offsetTop` | `number` | `0` | 高亮判定偏移（px），目标顶部进入该偏移内即视为激活 |
| `smooth` | `boolean` | `true` | 是否平滑滚动 |

`AnchorItem` 字段：`title`、`href`（形如 `#section-1`）、`children?`。

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `change` | `string` | 当前激活锚点的 `href` |
