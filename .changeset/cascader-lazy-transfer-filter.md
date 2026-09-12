---
"kb-ui-vue": minor
---

Cascader 支持异步加载，Transfer 支持搜索与分页：

**Cascader**

- 新增 `lazy` / `lazyLoad`，展开面板时按需拉取根级与各级子节点，加载中的那列显示「加载中…」
- 选项新增 `leaf` 标记，异步模式下点击即收起；`resolve` 返回空数组同样视为末级
- 新增 `clearable` / `disabled` / `separator`（已选路径分隔符）

**Transfer**

- 新增 `filterable` / `filterPlaceholder`，两侧独立搜索，无匹配时显示空状态
- 新增 `pageSize`，两侧独立分页；表头复选框作用于当前页，支持全选与半选态
- 新增 `titles` 自定义标题（带该侧条目数量）、`disabled` 整体禁用、条目级 `disabled`
- 新增 `change` 事件，携带穿梭方向
