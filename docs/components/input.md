# Input 输入框

支持 v-model 双向绑定、清除与尺寸。

## 基础用法

<KbSpace vertical :size="12">
  <KbInput v-model="value" placeholder="请输入内容" clearable style="width: 260px" />
  <span class="demo-hint">输入值：{{ value || '（空）' }}</span>
</KbSpace>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>

<template>
  <KbInput v-model="value" placeholder="请输入内容" clearable />
</template>
```

## 密码与禁用

<KbSpace wrap>
  <KbInput v-model="pwd" type="password" placeholder="密码" style="width: 200px" />
  <KbInput model-value="只读" disabled style="width: 200px" />
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string` | `''` | 绑定值 |
| `type` | `'text' \| 'password' \| 'number'` | `'text'` | 输入类型 |
| `placeholder` | `string` | — | 占位提示 |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `clearable` | `boolean` | `false` | 显示清除按钮 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | 输入时触发 |
| `change` | `string` | 失焦时触发 |
| `focus` / `blur` | `FocusEvent` | 聚焦/失焦 |

<script setup>
import { ref } from 'vue'
const value = ref('')
const pwd = ref('')
</script>

<style>
.demo-hint { color: var(--kb-color-text-3); font-size: var(--kb-font-size-sm); }
</style>
