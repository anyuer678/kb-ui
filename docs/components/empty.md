# Empty 空状态

数据为空时的占位提示，支持自定义描述与插槽。

## 基础用法

```vue
<template>
  <KbEmpty description="暂无数据" />
</template>
```

<KbEmpty description="暂无数据" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `description` | ``string`` | '暂无数据' | 描述文案 |
| `image` | ``string`` | '' | 自定义图片 URL |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 自定义占位内容 |
| ``description`` | 自定义描述 |

