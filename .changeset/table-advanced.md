---
'kb-ui-vue': minor
---

Table 表格能力补全，KbCheckbox 支持半选态：

- **Table 固定列**：新增 `TableColumn.fixed`（`'left' | 'right'`），配合 `width` 自动计算 sticky 偏移，列宽超出容器时自动横向滚动
- **Table 行选择**：新增 `selection` 与 `v-model:selectedKeys`，表头支持全选与半选态（全选作用于当前页），并派发 `selection-change`
- **Table 其他**：新增 `size` / `emptyText` / `TableColumn.align`；`sortable` 支持 `'custom'`（仅派发 `sort-change`，用于服务端排序）；`currentPage` 越界时自动回落到最后一页
- **Table 分页**：内部改用 `KbPagination` 组件渲染，替换原先无样式的裸 `<button>`；分页总数改为基于排序后的数据计算
- **KbCheckbox**：新增 `indeterminate` 半选态属性（通过 DOM property 设置并同步刷新）
