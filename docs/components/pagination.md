# Pagination 分页

数据分页控件，支持总页数/总数两种模式与快速跳页。

## 基础用法

```vue
<template>
  <KbPagination :total="100" :page-size="10" v-model:current-page="page" />
</template>
```

<KbPagination :total="100" :page-size="10" :current-page="3" @update:current-page="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `total` | ``number`` | `0` | 数据总数 |
| `page-size` | ``number`` | `10` | 每页条数 |
| `current-page` | ``number`` | `1` | 当前页 |
| `show-total` | ``boolean`` | `false` | 显示总数 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:current-page`` | ``number`` | 页码变化 |
| ``change`` | ``number`` | 页码变化（同义） |

