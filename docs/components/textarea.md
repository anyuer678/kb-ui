# Textarea 文本域

多行文本输入，支持字数统计与最大长度。

## 基础用法

```vue
<template>
  <KbTextarea v-model="text" :rows="3" :maxlength="200" show-word-limit />
</template>
```

<KbTextarea :model-value="'支持多行文本输入'" :rows="3" @update:model-value="() => {}" style="max-width: 480px" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string`` | '' | 值 |
| `rows` | ``number`` | `3` | 行数 |
| `maxlength` | ``number`` | — | 最大长度 |
| `show-word-limit` | ``boolean`` | `false` | 字数统计 |
| `resize` | `'none' \| 'both' \| 'vertical'` | 'vertical' | 缩放 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 输入 |

