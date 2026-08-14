# Search 搜索框

带搜索按钮的输入框，回车或点击触发 search 事件。

## 基础用法

```vue
<template>
  <KbSearch v-model="kw" @search="onSearch" />
</template>
```

<KbSearch :model-value="'关键字'" @search="() => {}" style="max-width: 360px" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``string`` | '' | 值 |
| `placeholder` | ``string`` | '搜索' | 占位 |
| `button-text` | ``string`` | '搜索' | 按钮文案 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 输入 |
| ``search`` | ``string`` | 搜索（回车/按钮） |

