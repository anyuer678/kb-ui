# Select 选择器

自绘下拉选择器，支持 v-model。

## 基础用法

<KbSpace>
  <KbSelect v-model="value" :options="options" placeholder="请选择水果" />
  <span class="demo-hint">已选：{{ value || '（未选择）' }}</span>
</KbSpace>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
]
</script>

<template>
  <KbSelect v-model="value" :options="options" placeholder="请选择水果" />
</template>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number` | — | 选中值 |
| `options` | `SelectOption[]` | — | 选项列表 |
| `placeholder` | `string` | `''` | 占位提示 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |

### SelectOption

| 属性 | 类型 | 说明 |
|---|---|---|
| `label` | `string` | 显示文字 |
| `value` | `string \| number` | 选项值 |
| `disabled` | `boolean` | 是否禁用 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| number` | 选择时触发 |
| `change` | `string \| number` | 选择时触发 |

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]
</script>

<style>
.demo-hint { color: var(--kb-color-text-3); font-size: var(--kb-font-size-sm); }
</style>
