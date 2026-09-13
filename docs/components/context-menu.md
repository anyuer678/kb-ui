# ContextMenu 右键菜单

在指定区域内右键唤出的菜单，位置会按视口边界自动修正。

## 基础用法

```vue
<template>
  <KbContextMenu :items="items" @select="onSelect">
    <div style="padding:40px;border:1px dashed #dcdfe6">在此区域右键</div>
  </KbContextMenu>
</template>

<script setup>
const items = [
  { key: 'copy', label: '复制' },
  { key: 'paste', label: '粘贴' },
  { key: 'delete', label: '删除', divided: true },
]
</script>
```

<KbContextMenu :items="menuItems" @select="() => {}">
  <div style="padding:32px;border:1px dashed #dcdfe6;text-align:center">在此区域点击右键</div>
</KbContextMenu>

## 禁用项与分隔线

`disabled` 的菜单项会跳过 `select`，`divided` 会在该项上方画一条分隔线。

```vue
<script setup>
const items = [
  { key: 'edit', label: '编辑', icon: 'edit' },
  { key: 'lock', label: '锁定', disabled: true },
  { key: 'remove', label: '删除', divided: true },
]
</script>
```

## 关闭方式

| 方式 | 说明 |
|---|---|
| 选中菜单项 | 派发 `select` 后自动关闭 |
| 点击菜单外部 | 自动关闭 |
| `Esc` | 自动关闭 |
| 调用实例方法 | `ref.close()` |

```vue
<template>
  <KbContextMenu ref="menu" :items="items">…</KbContextMenu>
</template>

<script setup>
import { ref } from 'vue'
const menu = ref()
const closeMenu = () => menu.value?.close()
</script>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | `ContextMenuItem[]` | `[]` | 菜单项 |
| `disabled` | `boolean` | `false` | 禁用右键菜单 |

`ContextMenuItem` 字段：`key`、`label`、`icon?`、`disabled?`、`divided?`。

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `select` | `string` | 选中项的 `key` |
| `open` | — | 菜单打开 |
| `close` | — | 菜单关闭 |

### 实例方法

| 方法 | 说明 |
|---|---|
| `close()` | 主动关闭菜单 |

<script setup>
const menuItems = [
  { key: 'copy', label: '复制' },
  { key: 'paste', label: '粘贴' },
  { key: 'rename', label: '重命名', disabled: true },
  { key: 'delete', label: '删除', divided: true },
]
</script>
