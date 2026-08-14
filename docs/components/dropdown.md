# Dropdown 下拉菜单

悬停/点击触发的菜单，支持命令回调。

## 基础用法

```vue
<template>
  <KbDropdown :items="[{ label: '编辑', command: 'edit' }]"><KbButton>更多</KbButton></KbDropdown>
</template>
```

<KbDropdown :items="[{ label: '编辑', command: 'edit' }, { label: '删除', command: 'del', danger: true }]"><KbButton>更多</KbButton></KbDropdown>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``DropdownItem[]`` | `[]` | 菜单项（label/command/divider/danger） |
| `trigger` | `'hover' \| 'click'` | 'hover' | 触发方式 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``command`` | ``string`` | 点击菜单项 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 触发元素 |

