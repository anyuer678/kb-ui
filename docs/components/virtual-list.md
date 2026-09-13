# VirtualList 虚拟列表

定高大数据量列表的窗口化渲染：只渲染可视区 + 缓冲区的项，滚动时复用 DOM，万级数据也能流畅滚动。

## 基础用法

`items` 传完整数据源，`itemHeight` 与 `height` 必填；默认插槽 `item` 接收 `{ item, index }`。

```vue
<template>
  <KbVirtualList :items="list" :item-height="40" :height="240">
    <template #item="{ item, index }">
      <div class="row">{{ index }} - {{ item.name }}</div>
    </template>
  </KbVirtualList>
</template>

<script setup>
const list = Array.from({ length: 10000 }, (_, i) => ({ name: `Item ${i}` }))
</script>
```

下方为 40 条静态数据的演示（可滚动，视口外不渲染）：

<KbVirtualList :items="['条目 0','条目 1','条目 2','条目 3','条目 4','条目 5','条目 6','条目 7','条目 8','条目 9','条目 10','条目 11','条目 12','条目 13','条目 14','条目 15','条目 16','条目 17','条目 18','条目 19','条目 20','条目 21','条目 22','条目 23','条目 24','条目 25','条目 26','条目 27','条目 28','条目 29','条目 30','条目 31','条目 32','条目 33','条目 34','条目 35','条目 36','条目 37','条目 38','条目 39']" :item-height="36" :height="144" style="max-width:320px;border:1px solid var(--kb-border,#dcdfe6)">
  <template #item="{ item, index }">
    <div style="height:36px;line-height:36px;padding:0 12px">{{ index }} - {{ item }}</div>
  </template>
</KbVirtualList>

## 缓冲区

`buffer` 控制视口上下各额外渲染的项数，增大可减少快速滚动时的白屏（默认 4）。

```vue
<KbVirtualList :items="list" :item-height="40" :height="240" :buffer="8">
  …
</KbVirtualList>
```

## 无限加载

滚动接近底部（默认提前 8px）时触发 `reachEnd`，可在此追加下一页数据。

```vue
<KbVirtualList
  :items="list"
  :item-height="40"
  :height="240"
  :reach-end-threshold="40"
  @reach-end="loadMore"
>
  …
</KbVirtualList>
```

## 空状态

`items` 为空时渲染 `empty` 插槽（默认「暂无数据」）。

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | `T[]` | — | 数据源 |
| `itemHeight` | `number` | — | 单项高度（px），固定高度模式 |
| `height` | `number` | — | 可视区高度（px） |
| `buffer` | `number` | `4` | 视口上下额外渲染的项数 |
| `reachEndThreshold` | `number` | `8` | 触发 `reachEnd` 的提前量（px） |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `scroll` | `number` | 滚动位置变化（scrollTop） |
| `reachEnd` | — | 滚动到底部 |

### 插槽

| 插槽 | 参数 | 说明 |
|---|---|---|
| `item` | `{ item, index }` | 每一项内容 |
| `empty` | — | 数据为空时的展示 |
