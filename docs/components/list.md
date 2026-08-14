# List 列表

通用列表容器，支持插槽与空态。

## 基础用法

```vue
<template>
  <KbList :items="['苹果']" />
</template>
```

<KbList :items="['苹果', '香蕉', '橙子']" bordered style="max-width: 360px" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``unknown[]`` | `[]` | 数据项 |
| `empty` | ``string`` | '暂无数据' | 空态文案 |
| `bordered` | ``boolean`` | `false` | 分割线 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``item`` | 自定义渲染（item/index） |

