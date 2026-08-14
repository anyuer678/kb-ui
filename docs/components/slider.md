# Slider 滑块

拖动选择数值，支持范围与步长。

## 基础用法

```vue
<template>
  <KbSlider v-model="value" :min="0" :max="100" />
</template>
```

<KbSlider :model-value="60" :min="0" :max="100" @update:model-value="() => {}" style="max-width: 360px" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``number`` | `0` | 当前值 |
| `min` | ``number`` | `0` | 最小值 |
| `max` | ``number`` | `100` | 最大值 |
| `step` | ``number`` | `1` | 步长 |
| `disabled` | ``boolean`` | `false` | 禁用 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``number`` | 值变化 |
| ``change`` | ``number`` | 拖动结束 |

