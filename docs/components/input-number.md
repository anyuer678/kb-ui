# InputNumber 数字输入

带步进按钮的数字输入框，支持范围与精度。

## 基础用法

```vue
<template>
  <KbInputNumber v-model="num" :min="0" :max="100" />
</template>
```

<KbInputNumber :model-value="10" :min="0" :max="100" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``number`` | `0` | 当前值 |
| `min` / `max` | ``number`` | — | 范围 |
| `step` | ``number`` | `1` | 步长 |
| `precision` | ``number`` | `0` | 小数位 |
| `disabled` | ``boolean`` | `false` | 禁用 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``number`` | 值变化 |

