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
] as const

/** 导出名与组件目录名不一致：导出名 → 目录名（即样式文件名） */
const ALIASED_ENTRIES: Record<string, string> = {
  Row: 'Grid',
  Col: 'Grid',
  FormItem: 'Form',
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
