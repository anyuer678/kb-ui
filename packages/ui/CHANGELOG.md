# @kb/ui

## 0.3.0

### Minor Changes

- 7706553: Cascader 支持异步加载，Transfer 支持搜索与分页：

  **Cascader**

  - 新增 `lazy` / `lazyLoad`，展开面板时按需拉取根级与各级子节点，加载中的那列显示「加载中…」
  - 选项新增 `leaf` 标记，异步模式下点击即收起；`resolve` 返回空数组同样视为末级
  - 新增 `clearable` / `disabled` / `separator`（已选路径分隔符）

  **Transfer**

  - 新增 `filterable` / `filterPlaceholder`，两侧独立搜索，无匹配时显示空状态
  - 新增 `pageSize`，两侧独立分页；表头复选框作用于当前页，支持全选与半选态
  - 新增 `titles` 自定义标题（带该侧条目数量）、`disabled` 整体禁用、条目级 `disabled`
  - 新增 `change` 事件，携带穿梭方向

- 8d29575: DatePicker 支持日期范围与多选，Calendar 支持区间高亮：

  - **DatePicker** 新增 `mode`（`'single' | 'range' | 'multiple'`）：
    - `range`：第一次点击定起点、第二次点击收口成区间，倒序点击自动交换起止；重新打开面板时会沿用只剩起点的那半截区间
    - `multiple`：面板保持展开，再次点击已选日期即取消该日期
  - **DatePicker** 新增 `clearable`（清空按钮）与 `separator`（range 起止分隔符）；补上文档里已声明、但组件此前并未实现的 `disabled`
  - **DatePicker** `placeholder` 默认值改为空字符串并按模式自动生成文案（原固定为「选择日期」）；`modelValue` 类型扩展为 `string | string[]`
  - **Calendar** 新增 `range`（区间高亮）与 `marked`（额外标记）属性，并导出 `CalendarDay` 类型

- 6afc74b: Table 表格能力补全，KbCheckbox 支持半选态：

  - **Table 固定列**：新增 `TableColumn.fixed`（`'left' | 'right'`），配合 `width` 自动计算 sticky 偏移，列宽超出容器时自动横向滚动
  - **Table 行选择**：新增 `selection` 与 `v-model:selectedKeys`，表头支持全选与半选态（全选作用于当前页），并派发 `selection-change`
  - **Table 其他**：新增 `size` / `emptyText` / `TableColumn.align`；`sortable` 支持 `'custom'`（仅派发 `sort-change`，用于服务端排序）；`currentPage` 越界时自动回落到最后一页
  - **Table 分页**：内部改用 `KbPagination` 组件渲染，替换原先无样式的裸 `<button>`；分页总数改为基于排序后的数据计算
  - **Table 服务端分页**：新增 `total` 属性——传入后总页数以 `total` 为准且 `data` 视为当前页（组件不再切片），配合 `sortable: 'custom'` 即可做真正的服务端分页排序；不传时行为与原先完全一致
  - **KbCheckbox**：新增 `indeterminate` 半选态属性（通过 DOM property 设置并同步刷新）

- 13c36b8: Tree 支持虚拟滚动与节点拖拽排序：

  - 新增 `height` / `itemHeight`，设置后只渲染视口内的行，支撑上千节点场景
  - 新增 `draggable` 与 `allowDrop`，支持 before / after / inner 三种落点，并内置「禁止拖入自身子孙」校验
  - 新增 `drop` 事件，抛出 `{ dragNode, dropNode, position, data }`，`data` 为调整后的完整树
  - 新增 `defaultExpandAll` 默认展开全部节点
  - 节点新增 `disabled` 支持，禁用后不可选中、不可拖拽

## 0.2.0

### Minor Changes

- 首次正式发布：14 个基础组件（Button/Icon/Tag/Space/Divider/Grid/Input/Checkbox/Radio/Switch/Select/Tooltip/Dialog/Message/Table）+ create-kb 脚手架 CLI。
