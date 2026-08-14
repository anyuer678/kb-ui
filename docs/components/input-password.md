# InputPassword 密码输入

密码输入框，点击眼睛切换明文。

## 基础用法

```vue
<template>
  <KbInputPassword v-model="password" />
</template>
```

<KbInputPassword :model-value="'123456'" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string`` | '' | 值 |
| `placeholder` | ``string`` | '' | 占位 |
| `size` | `'small' \| 'medium' \| 'large'` | 'medium' | 尺寸 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 输入 |

