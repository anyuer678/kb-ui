# Segmented 分段控制器

单选的按钮组，适合少量选项切换。

## 基础用法

```vue
<template>
  <KbSegmented v-model="view" :options="[{ label: '列表', value: 'list' }]" />
</template>
```

<KbSegmented :model-value="'week'" :options="[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string \| number`` | '' | 选中值 |
| `options` | ``SegmentedOption[]`` | `[]` | 选项（label/value/disabled） |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string \| number`` | 切换 |
| ``change`` | ``string \| number`` | 切换 |

