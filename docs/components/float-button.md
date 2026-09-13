# FloatButton 悬浮按钮

固定在页面角落的操作入口，支持语义色、形状、尺寸，并可通过 `FloatButtonGroup` 组成一组可展开的按钮。

## 基础用法

```vue
<template>
  <KbFloatButton type="primary" icon="plus" @click="onAdd" />
</template>
```

<KbFloatButton type="primary" icon="plus" tooltip="新增" />

## 形状与尺寸

<KbFloatButton shape="square" icon="edit" tooltip="方形" style="margin-right:16px" />
<KbFloatButton size="small" icon="search" tooltip="小号" style="margin-right:16px" />
<KbFloatButton size="large" icon="up" tooltip="大号" />

## 文字描述

传 `description` 后图标下方显示文字；`href` 传入后渲染为链接。

```vue
<KbFloatButton icon="doc" description="帮助文档" href="/guide" />
```

## 按钮组

`FloatButtonGroup` 内放置多个 `FloatButton`，点击触发器展开；`direction` 决定展开方向，`trigger` 支持 `click` / `hover`。

```vue
<template>
  <KbFloatButtonGroup shape="circle" direction="top" trigger="click">
    <KbFloatButton type="primary" icon="plus" />
    <KbFloatButton icon="question" />
  </KbFloatButtonGroup>
</template>
```

<KbFloatButtonGroup shape="circle" direction="top" trigger="click" style="position:relative;margin:24px 0 8px 24px">
  <KbFloatButton type="primary" icon="plus" />
  <KbFloatButton icon="question" />
</KbFloatButtonGroup>

## API

### FloatButton Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 语义色 |
| `shape` | `'circle' \| 'square'` | `'circle'` | 形状 |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | 尺寸 |
| `icon` | `string` | — | 图标名（见 Icon）；与默认插槽二选一 |
| `description` | `string` | — | 图标下方文字 |
| `tooltip` | `string` | — | 悬浮提示（同时作为无障碍名称） |
| `href` | `string` | — | 传入后渲染为 `<a>` |
| `target` | `'_self' \| '_blank'` | `'_blank'` | 链接打开方式 |
| `disabled` | `boolean` | `false` | 禁用 |
| `loading` | `boolean` | `false` | 加载中 |

### FloatButton 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击（禁用/加载中不触发） |

### FloatButtonGroup Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 展开方向 |
| `trigger` | `'click' \| 'hover'` | `'click'` | 触发方式 |
| `open` | `boolean` | `false` | 是否展开（`v-model:open`） |
| `icon` | `string` | `'plus'` | 触发器图标 |
| `shape` | `'circle' \| 'square'` | `'circle'` | 触发器形状 |
| `tooltip` | `string` | — | 触发器悬浮提示 |

### FloatButtonGroup 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:open` | `boolean` | 展开状态变化 |
