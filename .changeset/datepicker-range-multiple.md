---
'kb-ui-vue': minor
---

DatePicker 支持日期范围与多选，Calendar 支持区间高亮：

- **DatePicker** 新增 `mode`（`'single' | 'range' | 'multiple'`）：
  - `range`：第一次点击定起点、第二次点击收口成区间，倒序点击自动交换起止；重新打开面板时会沿用只剩起点的那半截区间
  - `multiple`：面板保持展开，再次点击已选日期即取消该日期
- **DatePicker** 新增 `clearable`（清空按钮）与 `separator`（range 起止分隔符）；补上文档里已声明、但组件此前并未实现的 `disabled`
- **DatePicker** `placeholder` 默认值改为空字符串并按模式自动生成文案（原固定为「选择日期」）；`modelValue` 类型扩展为 `string | string[]`
- **Calendar** 新增 `range`（区间高亮）与 `marked`（额外标记）属性，并导出 `CalendarDay` 类型
