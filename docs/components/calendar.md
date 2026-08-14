# Calendar 日历

月视图日历，支持选择日期与自定义单元格。

## 基础用法

```vue
<template>
  <KbCalendar v-model="date" />
</template>
```

<KbCalendar :model-value="'2026-08-15'" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string`` | '' | 选中日期（YYYY-MM-DD） |
| `first-day` | ``number`` | `1` | 周起始（0 周日） |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 选择日期 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``cell`` | 自定义单元格 |

