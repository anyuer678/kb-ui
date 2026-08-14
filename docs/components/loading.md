# Loading 加载中

全屏/局部加载遮罩，支持文案与图标切换。

## 基础用法

```vue
<template>
  <KbLoading v-model="loading" text="加载中…" />
</template>
```

<KbLoading :model-value="false" text="加载中…"><div style="height: 100px; display: grid; place-items: center; border: 1px dashed var(--kb-color-border); border-radius: 8px">内容区域</div></KbLoading>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``boolean`` | `false` | 是否加载 |
| `text` | ``string`` | '' | 加载文案 |
| `fullscreen` | ``boolean`` | `false` | 全屏遮罩 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 内容区域 |

