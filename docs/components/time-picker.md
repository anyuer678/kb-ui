# TimePicker 时间选择

逐列选择时 / 分 / 秒，输出固定格式的时间字符串。

## 基础用法

默认格式 `HH:mm`，只展示时与分两列。

```vue
<template>
  <KbTimePicker v-model="value" />
</template>
```

<KbTimePicker :model-value="'09:30'" @update:model-value="() => {}" />

## 精确到秒

`format` 含 `ss` 时自动启用秒列。

```vue
<template>
  <KbTimePicker v-model="value" format="HH:mm:ss" />
</template>
```

<KbTimePicker :model-value="'09:30:00'" format="HH:mm:ss" @update:model-value="() => {}" />

## 分钟步长

`minute-step="15"` 时分钟列只出现 `00 / 15 / 30 / 45`。

```vue
<template>
  <KbTimePicker v-model="value" :minute-step="15" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string` | `''` | 时间字符串，如 `09:30` / `09:30:00` |
| `format` | `string` | `'HH:mm'` | 展示格式，含 `ss` 时启用秒列 |
| `placeholder` | `string` | 语言包 `timePicker.placeholder` | 占位文案 |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 可清空 |
| `minuteStep` | `number` | `1` | 分钟步长 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | 时间变化 |
| `change` | `string` | 时间变化 |
