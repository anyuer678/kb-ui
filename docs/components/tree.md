# Tree 树形控件

树形数据展示，支持展开/折叠/选中、虚拟滚动与节点拖拽排序。

## 基础用法

```vue
<script setup lang="ts">
const data = [
  { label: '前端', children: [{ label: 'Vue' }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }] },
]
</script>

<template>
  <KbTree :data="data" @select="(node) => console.log(node)" />
</template>
```

<KbTree :data="treeData" />

`default-expand-all` 可一次性展开所有含子节点的节点：

<KbTree :data="treeData" default-expand-all />

## 虚拟滚动

节点上千时给 `height` 赋一个可视区高度（px）即可开启虚拟滚动——组件只渲染视口内的行，滚动时动态替换渲染窗口，DOM 数量始终保持在几十行级别。

<KbTree :data="hugeData" :height="240" />
<p>共 {{ hugeData.length }} 个节点，实际只渲染约 14 行 DOM。</p>

## 拖拽排序

打开 `draggable` 后行可拖动，落点分三档：行上缘为 `before`、下缘为 `after`、中间为 `inner`（成为子节点，目标已有子节点时可用）。拖拽完成后组件会**调整内部数据副本**并通过 `drop` 事件抛出新的完整树。

<KbTree :data="dragData" draggable @drop="onDrop" />
<p>最近一次落点：{{ lastDrop || '（尚未拖拽）' }}</p>

用 `allow-drop` 做落点校验，返回 `false` 的位置会被直接忽略（不显示落点指示、不派发事件）：

```vue
<template>
  <KbTree
    :data="data"
    draggable
    :allow-drop="(drag, drop, position) => drag.value !== 'root' && position !== 'inner'"
    @drop="({ data }) => (tree = data)"
  />
</template>
```

> 组件内置了「禁止把节点拖进自己的子孙节点」的校验，无需额外处理。

## API

### TreeNode

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `label` | `string` | — | 节点显示文本 |
| `value` | `string` | — | 节点值（可选，便于业务识别） |
| `children` | `TreeNode[]` | — | 子节点 |
| `disabled` | `boolean` | `false` | 禁用后不可选中、不可拖拽 |

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `data` | `TreeNode[]` | `[]` | 树数据 |
| `height` | `number \| null` | `null` | 可视区高度，设置后启用虚拟滚动 |
| `itemHeight` | `number` | `32` | 虚拟滚动下单行高度（px） |
| `draggable` | `boolean` | `false` | 是否可拖拽排序 |
| `allowDrop` | `(drag, drop, position) => boolean` | — | 落点校验，返回 `false` 禁止落下 |
| `defaultExpandAll` | `boolean` | `false` | 默认展开全部含子节点的节点 |

### 事件

| 名称 | 参数 | 说明 |
|---|---|---|
| `select` | `TreeNode` | 选中节点 |
| `drop` | `{ dragNode, dropNode, position, data }` | 拖拽完成，`position` 为 `before \| after \| inner`，`data` 为调整后的完整树 |

<script setup>
import { ref } from 'vue'

const treeData = [
  { label: '前端', children: [{ label: 'Vue' }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }, { label: 'Go' }] },
  { label: '设计', children: [{ label: 'Figma' }] },
]

const hugeData = Array.from({ length: 1000 }, (_, i) => ({ label: `节点 ${i + 1}` }))

const dragData = ref([
  { label: '前端', children: [{ label: 'Vue' }, { label: 'React' }] },
  { label: '后端', children: [{ label: 'Node' }] },
  { label: '设计' },
])
const lastDrop = ref('')
function onDrop({ dragNode, dropNode, position }) {
  lastDrop.value = `${dragNode.label} → ${dropNode.label}（${position}）`
}
</script>
