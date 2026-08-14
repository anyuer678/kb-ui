# Tree 树形控件

树形数据展示，支持展开/折叠/选中。

## 基础用法

```vue
<template>
  <KbTree :data="[{ label: '节点', children: [] }]" />
</template>
```

<KbTree :data="[{ label: '根节点', children: [{ label: '子节点 1', children: [{ label: '叶子' }] }, { label: '子节点 2' }] }]" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | ``TreeNode[]`` | `[]` | 树数据（label/children） |
| `default-expanded` | ``boolean`` | `false` | 默认展开 |
| `selectable` | ``boolean`` | `true` | 可选中 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``select`` | ``TreeNode`` | 选中节点 |

