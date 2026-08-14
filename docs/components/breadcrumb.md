# Breadcrumb 面包屑

页面路径导航，支持分隔符自定义与链接跳转。

## 基础用法

```vue
<template>
  <KbBreadcrumb :items="[{ label: '首页', href: '/' }, { label: '组件' }, { label: '面包屑' }]" />
</template>
```

<KbBreadcrumb :items="[{ label: '首页', href: '/' }, { label: '组件' }, { label: '面包屑' }]" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``BreadcrumbItem[]`` | `[]` | 面包屑项（label/href） |
| `separator` | ``string`` | '/' | 分隔符 |

