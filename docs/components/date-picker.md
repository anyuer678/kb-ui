# DatePicker 日期选择

日期选择器，弹出日历面板。支持单日期、日期范围、多日期三种模式。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const date = ref('2026-08-15')
</script>

<template>
  <KbDatePicker v-model="date" />
</template>
```

<KbDatePicker v-model="single" />

## 日期范围

`mode="range"` 时 `modelValue` 为 `[start, end]`。第一次点击定起点，第二次点击收口成区间；**倒序点击会自动交换起止**。

<KbDatePicker v-model="range" mode="range" clearable />
<p>已选：{{ range.length === 2 ? range.join(' 至 ') : '（未选完整）' }}</p>

## 多日期

`mode="multiple"` 时面板保持展开，再次点击已选日期即取消该日期。

<KbDatePicker v-model="dates" mode="multiple" clearable />
<p>已选 {{ dates.length }} 天：{{ dates.join('、') || '（无）' }}</p>

## 禁用

<KbDatePicker v-model="single" disabled />

## 自定义分隔符

<KbDatePicker :model-value="['2026-08-10', '2026-08-20']" mode="range" separator=" ~ " />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| string[]` | `''` | single 模式为字符串；range 模式为 `[start, end]`；multiple 模式为日期数组 |
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | 选择模式 |
| `placeholder` | `string` | 按模式自动生成 | 占位文案 |
| `separator` | `string` | `' 至 '` | range 模式的起止分隔符 |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 显示清空按钮 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| string[]` | 选择变化；single 派发字符串，range / multiple 派发数组 |

<script setup>
import { ref } from 'vue'

const single = ref('2026-08-15')
const range = ref(['2026-08-10', '2026-08-20'])
const dates = ref(['2026-08-03', '2026-08-12'])
</script>
