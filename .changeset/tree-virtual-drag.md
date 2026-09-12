---
"kb-ui-vue": minor
---

Tree 支持虚拟滚动与节点拖拽排序：

- 新增 `height` / `itemHeight`，设置后只渲染视口内的行，支撑上千节点场景
- 新增 `draggable` 与 `allowDrop`，支持 before / after / inner 三种落点，并内置「禁止拖入自身子孙」校验
- 新增 `drop` 事件，抛出 `{ dragNode, dropNode, position, data }`，`data` 为调整后的完整树
- 新增 `defaultExpandAll` 默认展开全部节点
- 节点新增 `disabled` 支持，禁用后不可选中、不可拖拽
