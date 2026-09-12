# Transfer 穿梭框

左右列表穿梭选择，支持搜索过滤、分页与批量全选。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = [
  { key: 'a', label: '选项 A' },
  { key: 'b', label: '选项 B' },
  { key: 'c', label: '选项 C' },
]
const value = ref(['a'])
</script>

<template>
  <KbTransfer v-model="value" :data="data" />
</template>
```

<KbTransfer v-model="basicValue" :data="basicData" />

点选条目后用中间的箭头批量移动，移动会清空两侧的勾选状态。`change` 事件额外携带移动方向。

## 搜索过滤

打开 `filterable` 后两侧面板各带一个搜索框，按 `label` 做不区分大小写的包含匹配；搜索结果为空时显示空状态。

<KbTransfer v-model="searchValue" :data="manyData" filterable />

## 分页

`pageSize` 大于 0 时两侧独立分页，翻页互不影响。表头复选框**作用于当前页的可选条目**（搜索状态下即当前搜索结果），支持全选与半选态。

<KbTransfer v-model="pagedValue" :data="manyData" filterable :page-size="6" />

## 自定义标题与禁用

`titles` 分别设置左右面板标题，标题后会显示该侧条目数量。

<KbTransfer v-model="disabledValue" :data="basicData" :titles="['候选列表', '已选列表']" disabled />

## API

### TransferItem

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `key` | `string` | — | 唯一键 |
| `label` | `string` | — | 显示文本 |
| `disabled` | `boolean` | `false` | 禁用该项，不可选中 |

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | `TransferItem[]` | `[]` | 全部数据 |
| `modelValue` | `string[]` | `[]` | 右侧已选 key 列表 |
| `titles` | `[string, string]` | `['待选', '已选']` | 左右面板标题 |
| `filterable` | `boolean` | `false` | 开启搜索过滤 |
| `filterPlaceholder` | `string` | `'请输入搜索内容'` | 搜索框占位文案 |
| `pageSize` | `number` | `0` | 每页条数，`0` 表示不分页 |
| `disabled` | `boolean` | `false` | 整体禁用 |

### 事件

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `(value: string[])` | 穿梭结果变化 |
| `change` | `(value: string[], direction: 'left' \| 'right')` | 与上者同时派发，附带移动方向 |

<script setup>
import { ref } from 'vue'

const basicData = [
  { key: 'a', label: '选项 A' },
  { key: 'b', label: '选项 B' },
  { key: 'c', label: '选项 C' },
]
const manyData = Array.from({ length: 24 }, (_, i) => ({
  key: `k${i + 1}`,
  label: `候选项目 ${i + 1}`,
}))

const basicValue = ref(['a'])
const searchValue = ref([])
const pagedValue = ref(['k1', 'k2'])
const disabledValue = ref(['a'])
</script>
