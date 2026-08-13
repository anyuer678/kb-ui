# Table 表格

声明式数据表格，支持自定义单元格渲染。

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

## 自定义单元格

<KbTable :data="tableData" :columns="tableColumns" border>
  <template #cell="{ row, column }">
    <KbTag v-if="column.prop === 'city'" type="primary">{{ row[column.prop] }}</KbTag>
    <span v-else>{{ row[column.prop] }}</span>
  </template>
</KbTable>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | `Record<string, unknown>[]` | — | 表格数据 |
| `columns` | `TableColumn[]` | — | 列配置 |
| `stripe` | `boolean` | `false` | 条纹行 |
| `border` | `boolean` | `false` | 外边框与列线 |

### TableColumn

| 属性 | 类型 | 说明 |
|---|---|---|
| `prop` | `string` | 数据字段名 |
| `label` | `string` | 表头文字 |
| `width` | `string \| number` | 列宽 |

### 插槽

| 名称 | 作用域参数 | 说明 |
|---|---|---|
| `cell` | `{ row, column, index }` | 自定义单元格内容 |

<script setup>
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
</script>
