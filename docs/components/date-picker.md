# DatePicker 日期选择

日期选择器，弹出日历面板。

## 基础用法

```vue
<template>
  <KbDatePicker v-model="date" />
</template>
```

<KbDatePicker :model-value="'2026-08-15'" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string`` | '' | 日期（YYYY-MM-DD） |
| `placeholder` | ``string`` | '选择日期' | 占位 |
| `disabled` | ``boolean`` | `false` | 禁用 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 选择 |

