# ColorPicker 颜色选择

预设色板取色器，支持自定义颜色。

## 基础用法

```vue
<template>
  <KbColorPicker v-model="color" />
</template>
```

<KbColorPicker :model-value="'#3b82f6'" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string`` | '#3b82f6' | 颜色值 |
| `preset` | ``string[]`` | 内置色板 | 预设色 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 取色 |

