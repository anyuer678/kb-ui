# Rate 评分

星级评分，支持半星与只读。

## 基础用法

```vue
<template>
  <KbRate v-model="score" />
</template>
```

<KbRate :model-value="4" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``number`` | `0` | 分值 |
| `count` | ``number`` | `5` | 星数 |
| `allow-half` | ``boolean`` | `false` | 半星 |
| `readonly` | ``boolean`` | `false` | 只读 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``number`` | 评分变化 |

