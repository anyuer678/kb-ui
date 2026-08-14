# Transfer 穿梭框

左右列表穿梭选择，支持批量移动。

## 基础用法

```vue
<template>
  <KbTransfer :data="[{ key: 'a', label: 'A' }]" v-model="selected" />
</template>
```

<KbTransfer :data="[{ key: 'a', label: '选项 A' }, { key: 'b', label: '选项 B' }, { key: 'c', label: '选项 C' }]" :model-value="['a']" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | ``TransferItem[]`` | `[]` | 数据（key/label） |
| `modelValue` | ``string[]`` | `[]` | 已选 key |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string[]`` | 穿梭变化 |

