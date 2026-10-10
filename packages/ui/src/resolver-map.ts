/**
 * 组件导出名 → 样式入口映射（供 resolver 使用）
 *
 * 由 `src/components/*` 与 `dist/styles/*.css` 的对应关系整理而来。
 * 新增组件时需在此登记：
 * - 目录名与导出名一致 → 加进 SAME_NAME_ENTRIES
 * - 一个目录导出多个组件（Grid → Row/Col）→ 加进 ALIASED_ENTRIES
 * - 没有样式产物 → 加进 STYLELESS_ENTRIES
 */

/** 组件目录名与导出名一致，且各自有同名样式文件 */
const SAME_NAME_ENTRIES = [
  'Alert',
  'Avatar',
  'Badge',
  'Breadcrumb',
  'Button',
  'Calendar',
  'Card',
  'Carousel',
  'Cascader',
  'Checkbox',
  'Collapse',
  'ColorPicker',
  'CountUp',
  'DatePicker',
  'Descriptions',
  'Dialog',
  'Divider',
  'Drawer',
  'Dropdown',
  'Empty',
  'Form',
  'Grid',
  'Icon',
  'Input',
  'InputNumber',
  'InputPassword',
  'List',
  'Loading',
  'Message',
  'Notification',
  'Pagination',
  'Popconfirm',
  'Popover',
  'Progress',
  'Radio',
  'Rate',
  'Result',
  'Search',
  'Segmented',
  'Select',
  'Skeleton',
  'Slider',
  'Space',
  'Statistic',
  'Steps',
  'Switch',
  'Table',
  'Tabs',
  'Tag',
  'Textarea',
  'Timeline',
  'Tooltip',
  'Transfer',
  'Tree',
  'Upload',
  'Watermark',
  // 后续新增组件按加入顺序追加（顺序不影响映射结果）
  'Affix',
  'Anchor',
  'AutoComplete',
  'BackTop',
  'ContextMenu',
  'Image',
  'ImagePreview',
  'Splitter',
  'TimePicker',
  'Tour',
  'TreeSelect',
  'FloatButton',
  'Layout',
  'Mentions',
  'QRCode',
  'VirtualList',
] as const

/** 导出名与组件目录名不一致：导出名 → 目录名（即样式文件名） */
const ALIASED_ENTRIES: Record<string, string> = {
  Row: 'Grid',
  Col: 'Grid',
  FormItem: 'Form',
  FloatButtonGroup: 'FloatButton',
  Header: 'Layout',
  Sider: 'Layout',
  Content: 'Layout',
  Footer: 'Layout',
}

/** 无样式产物的组件：参与组件解析但不引入任何 CSS */
const STYLELESS_ENTRIES = ['ConfigProvider'] as const

/**
 * 组件导出名 → `dist/styles` 下的文件名（不含扩展名）。
 * 值为空字符串表示该组件没有独立样式。
 */
export const styleEntryMap: Record<string, string> = {
  ...Object.fromEntries(SAME_NAME_ENTRIES.map((name) => [name, name])),
  ...ALIASED_ENTRIES,
  ...Object.fromEntries(STYLELESS_ENTRIES.map((name) => [name, ''])),
}

/**
 * 复合组件的内嵌子组件（导出名，已展开为传递闭包）。
 *
 * 按需引入复合组件时，resolver 需把内嵌子组件的样式一并带入——
 * 否则 `<KbTable>` 的勾选列（Checkbox）与分页器（Pagination）、
 * `<KbAlert>` 的图标（Icon）等在按需模式下全部裸奔（外部审查 2026-10）。
 *
 * 全量引入（styles/index.css）不受影响：它本来就聚合全部组件样式。
 * 维护方式：组件新增 `from '../Xxx'` 的内部依赖时，在此登记一条。
 */
export const compositeDeps: Record<string, string[]> = {
  Alert: ['Icon'],
  AutoComplete: ['Icon'],
  Avatar: ['Icon'],
  BackTop: ['Icon'],
  ContextMenu: ['Icon'],
  DatePicker: ['Icon', 'Calendar'],
  Empty: ['Icon'],
  FloatButton: ['Icon'],
  // Image 内嵌 ImagePreview，ImagePreview 又内嵌 Icon——此处直接写闭包
  Image: ['Icon', 'ImagePreview'],
  ImagePreview: ['Icon'],
  InputPassword: ['Icon'],
  Layout: ['Icon'],
  Message: ['Icon'],
  Notification: ['Icon'],
  Result: ['Icon'],
  Search: ['Icon'],
  Steps: ['Icon'],
  Table: ['Checkbox', 'Pagination'],
  TimePicker: ['Icon'],
  Tour: ['Icon'],
  Transfer: ['Checkbox'],
  TreeSelect: ['Icon'],
}
