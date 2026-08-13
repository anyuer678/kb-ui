# Icon 图标

内置常用图标（SVG stroke 风格，24x24 视图）。

## 基础用法

```vue
<template>
  <KbIcon name="check" :size="20" color="#16a34a" />
</template>
```

<KbSpace wrap>
  <KbIcon v-for="name in ['check', 'close', 'info', 'warning', 'success', 'error', 'arrow-left', 'arrow-right', 'search', 'menu', 'loading', 'chevron-down']" :key="name" :name="name" :size="24" />
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `name` | `string` | — | 图标名（内置 12 个） |
| `size` | `number \| string` | `16` | 宽高（px） |
| `color` | `string` | — | 颜色（默认继承 `currentColor`） |

### 内置图标

`check`、`close`、`info`、`warning`、`success`、`error`、`arrow-left`、`arrow-right`、`search`、`menu`、`loading`、`chevron-down`

::: tip
`loading` 图标配合 CSS `animation` 可实现加载旋转效果。
:::
