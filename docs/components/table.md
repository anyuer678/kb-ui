# Table 表格

声明式数据表格，支持排序、分页、固定列、行选择与自定义单元格渲染。

## 基础用法

```vue
<script setup lang="ts">
const data = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 20, city: '上海' },
]
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市' },
]
</script>

<template>
  <KbTable :data="data" :columns="columns" stripe border />
</template>
```

<KbTable :data="tableData" :columns="tableColumns" stripe border />

## 排序与分页

列上声明 `sortable: true` 打开内置排序（升 → 降 → 取消三态）；`pageSize` 大于 0 时启用分页。

<KbTable
  v-model:current-page="page"
  :data="bigData"
  :columns="sortColumns"
  :page-size="10"
  stripe
  border
/>
<p>当前第 {{ page }} 页</p>

服务端排序场景用 `sortable: 'custom'`，组件只派发 `sort-change`，不干预数据顺序。

服务端分页则再传一个 `total`（接口返回的总条数）：此时 `data` 就是当前页数据，组件不再做切片，
分页器按 `total` / `pageSize` 计算页数。配合 `sortable: 'custom'` 即可完成「翻页/排序都回后端取数」：

```vue
<KbTable
  :data="rows"
  :columns="columns"
  :total="total"
  :page-size="20"
  :current-page="page"
  row-key="id"
  @sort-change="onSort"
  @update:current-page="onPageChange"
/>
```

```vue
<template>
  <KbTable :data="rows" :columns="columns" @sort-change="fetchList" />
</template>
```

## 固定列

给列声明 `fixed: 'left'` 或 `fixed: 'right'`，并**务必指定 `width`**——固定偏移量由列宽累加得出。列宽总和超出容器时自动出现横向滚动。

<KbTable :data="bigData.slice(0, 6)" :columns="fixedColumns" border />

## 行选择

打开 `selection` 并指定 `row-key`（行唯一键字段）。表头复选框支持全选与半选态，**全选作用于当前页**。

<KbTable
  v-model:selected-keys="selected"
  :data="tableData"
  :columns="tableColumns"
  selection
  row-key="name"
  border
/>
<p>已选：{{ selected.join('、') || '（无）' }}</p>

## 自定义单元格

<KbTable :data="tableData" :columns="tableColumns" border>
  <template #cell="{ row, column }">
    <KbTag v-if="column.prop === 'city'" type="primary">{{ row[column.prop] }}</KbTag>
    <span v-else>{{ row[column.prop] }}</span>
  </template>
</KbTable>

## 空状态

<KbTable :data="[]" :columns="tableColumns" empty-text="暂无数据，请先创建" border />

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | `Record<string, unknown>[]` | — | 表格数据 |
| `columns` | `TableColumn[]` | — | 列配置 |
| `stripe` | `boolean` | `false` | 条纹行 |
| `border` | `boolean` | `false` | 外边框与列线 |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | 尺寸 |
| `rowKey` | `string` | — | 行唯一键字段名，不传则用行索引 |
| `pageSize` | `number` | `0` | 每页条数，`0` 表示不分页 |
| `currentPage` | `number` | `1` | 当前页（1-based），配合 `v-model:current-page` |
| `total` | `number` | — | 总条数；**传入即视为服务端分页**，`data` 只放当前页，组件不再切片 |
| `selection` | `boolean` | `false` | 是否显示行选择列 |
| `selectedKeys` | `(string \| number)[]` | `[]` | 已选行的 key，配合 `v-model:selected-keys` |
| `emptyText` | `string` | `'暂无数据'` | 数据为空时的文案 |

### TableColumn

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `prop` | `string` | — | 数据字段名 |
| `label` | `string` | — | 表头文字 |
| `width` | `string \| number` | — | 列宽，固定列必须指定 |
| `sortable` | `boolean \| 'custom'` | — | 是否可排序；`'custom'` 表示仅派发事件 |
| `fixed` | `'left' \| 'right'` | — | 固定列方向 |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | 单元格对齐方式 |

### 事件

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:current-page` | `(page: number)` | 页码变化 |
| `sort-change` | `(prop: string, order: 'asc' \| 'desc' \| null)` | 排序变化 |
| `update:selected-keys` | `(keys: (string \| number)[])` | 选中行变化 |
| `selection-change` | `(keys: (string \| number)[])` | 选中行变化（与上者同时派发） |

### 插槽

| 名称 | 作用域参数 | 说明 |
|---|---|---|
| `cell` | `{ row, column, index }` | 自定义单元格内容 |

<script setup>
import { ref } from 'vue'

const tableData = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 20, city: '上海' },
  { name: '王五', age: 22, city: '广州' },
]
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市' },
]
const bigData = Array.from({ length: 46 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  company: ['星尘科技', '云图数据', '南栀软件', '澜川网络'][i % 4],
  city: ['北京', '上海', '广州', '成都', '杭州'][i % 5],
  email: `user${i + 1}@example.com`,
  role: ['管理员', '编辑', '访客'][i % 3],
  score: (i * 37) % 100,
}))
const sortColumns = [
  { prop: 'name', label: '姓名', width: 160 },
  { prop: 'score', label: '评分（可排序）', width: 140, sortable: true },
  { prop: 'city', label: '城市', width: 120 },
]
const fixedColumns = [
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: '姓名', width: 120, fixed: 'left' },
  { prop: 'company', label: '公司', width: 320 },
  { prop: 'email', label: '邮箱', width: 320 },
  { prop: 'city', label: '城市', width: 200 },
  { prop: 'role', label: '角色', width: 140, fixed: 'right' },
]
const page = ref(1)
const selected = ref([])
</script>
