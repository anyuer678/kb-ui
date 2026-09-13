/**
 * 组件库语言包类型定义
 *
 * 语言包按组件分组，key 层级与 ProjectLocale 结构一一对应。
 * 新增 Kb 组件时若引入了面向用户展示的内置文案（含 aria-label 等无障碍
 * 标注文案），必须在此处补 key，否则 zh-CN 之外的包会因缺字段而类型报错。
 */

/** 全局通用文案 */
export interface CommonLocale {
  /** 确定 */
  confirm: string
  /** 取消 */
  cancel: string
  /** 清空 */
  clear: string
  /** 关闭 */
  close: string
  /** 加载中 */
  loading: string
  /** 搜索 / 过滤无结果 */
  noMatch: string
  /** 未选择时的通用占位文案 */
  placeholder: string
}

export interface BackTopLocale {
  /** 回到顶部按钮的无障碍标注 */
  label: string
}

export interface AnchorLocale {
  /** 锚点导航的无障碍标注 */
  label: string
}

export interface ImageLocale {
  /** 图片加载失败 */
  loadFailed: string
  /** 点击预览的无障碍标注 */
  preview: string
  /** 预览浮层（role=dialog）的无障碍标注 */
  previewDialog: string
  zoomIn: string
  zoomOut: string
  rotate: string
  prev: string
  next: string
}

export interface TourLocale {
  next: string
  prev: string
  finish: string
  skip: string
  /** 关闭引导的无障碍标注 */
  close: string
  /** 当前步骤没有标题时，引导气泡（role=dialog）的回退无障碍标注 */
  label: string
}

export interface SplitterLocale {
  /** 分隔条（role=separator）的无障碍标注 */
  label: string
}

export interface ContextMenuLocale {
  /** 右键菜单（role=menu）的无障碍标注 */
  label: string
}

export interface TimePickerLocale {
  /** 未选择时的占位文案 */
  placeholder: string
  /** 选择框（role=combobox）的无障碍标注 */
  label: string
  /** 小时列（role=listbox）的无障碍标注 */
  hour: string
  /** 分钟列（role=listbox）的无障碍标注 */
  minute: string
  /** 秒列（role=listbox）的无障碍标注 */
  second: string
}

export interface TreeSelectLocale {
  /** 选择框（role=combobox）与下拉树的无障碍标注 */
  label: string
}

export interface LayoutLocale {
  /** 折叠触发器在展开状态下的无障碍标注 */
  collapse: string
  /** 折叠触发器在收起状态下的无障碍标注 */
  expand: string
}

export interface EmptyLocale {
  /** 空状态描述 */
  description: string
}

export interface ListLocale {
  /** 列表无数据时的文案 */
  empty: string
}

export interface TableLocale {
  /** 表格无数据时的文案 */
  emptyText: string
}

export interface CascaderLocale {
  /** 未选择时的占位文案 */
  placeholder: string
  /** 子节点异步加载中 */
  loading: string
  /** 叶子节点角标 */
  leafTag: string
  /** 面板的无障碍标注 */
  panel: string
  /** 第 N 级列的无障碍标注，含 %s 占位 */
  level: string
}

export interface CalendarLocale {
  prevMonth: string
  nextMonth: string
  /** 标题「YYYY 年 M 月」的拼接模板，%s 依次为年、月 */
  title: string
  /** 周一起始的星期缩写，长度固定为 7 */
  weekShorts: string[]
}

export interface DatePickerLocale {
  /** 范围选择时两个日期之间的分隔符 */
  separator: string
  /** 多选模式下已选日期数的展示文案，含 %s 占位 */
  selectedCount: string
  /** 单选面板的无障碍标注 */
  panel: string
  /** 范围面板的无障碍标注 */
  panelRange: string
  /** 多选面板的无障碍标注 */
  panelMultiple: string
}

export interface DialogLocale {
  /** 无标题时对话框的默认无障碍标注 */
  panel: string
}

export interface FormLocale {
  /** 必填校验失败时的默认文案，%s 为字段名 */
  required: string
  /** 格式校验失败时的默认文案，%s 为字段名 */
  pattern: string
  /** 自定义校验失败时的默认文案，%s 为字段名 */
  invalid: string
}

export interface CarouselLocale {
  prev: string
  next: string
  /** 第 N 张指示器的无障碍标注，含 %s 占位 */
  indicator: string
}

export interface ColorPickerLocale {
  /** 单个色块的无障碍标注，含 %s 占位（颜色值） */
  pick: string
}

export interface InputPasswordLocale {
  show: string
  hide: string
}

export interface PaginationLocale {
  prev: string
  next: string
  /** 每页 N 条，含 %s 占位 */
  pageSize: string
  /** 总数展示文案，含 %s 占位 */
  total: string
}

export interface PopconfirmLocale {
  confirmText: string
  cancelText: string
}

export interface SearchLocale {
  placeholder: string
  /** 搜索按钮文案 */
  action: string
}

export interface TransferLocale {
  /** 两侧面板标题，长度固定为 2：[待选面板, 已选面板] */
  titles: [string, string]
  /** 搜索框占位文案 */
  filterPlaceholder: string
  /** 搜索无结果 */
  noMatch: string
  prevPage: string
  nextPage: string
}

export interface UploadLocale {
  /** 选择文件按钮文案 */
  chooseFile: string
  /** 删除按钮的无障碍标注 */
  remove: string
  /** 上传中状态文案，%s 为百分比 */
  uploading: string
  /** 已上传状态文案 */
  uploaded: string
  /** 上传失败状态文案 */
  failed: string
}

/** 完整语言包结构 */
export interface ProjectLocale {
  /** 语言包名，如 zh-CN */
  name: string
  common: CommonLocale
  anchor: AnchorLocale
  backTop: BackTopLocale
  empty: EmptyLocale
  image: ImageLocale
  tour: TourLocale
  splitter: SplitterLocale
  contextMenu: ContextMenuLocale
  timePicker: TimePickerLocale
  treeSelect: TreeSelectLocale
  layout: LayoutLocale
  list: ListLocale
  table: TableLocale
  cascader: CascaderLocale
  calendar: CalendarLocale
  datePicker: DatePickerLocale
  dialog: DialogLocale
  form: FormLocale
  carousel: CarouselLocale
  colorPicker: ColorPickerLocale
  inputPassword: InputPasswordLocale
  pagination: PaginationLocale
  popconfirm: PopconfirmLocale
  search: SearchLocale
  transfer: TransferLocale
  upload: UploadLocale
}

/** 允许递归取值点号的 key 路径，如 `empty.description` */
export type LocalePath =
  | 'common.confirm'
  | 'common.cancel'
  | 'common.clear'
  | 'common.close'
  | 'common.loading'
  | 'common.noMatch'
  | 'common.placeholder'
  | 'anchor.label'
  | 'backTop.label'
  | 'image.loadFailed'
  | 'image.preview'
  | 'image.previewDialog'
  | 'image.zoomIn'
  | 'image.zoomOut'
  | 'image.rotate'
  | 'image.prev'
  | 'image.next'
  | 'tour.next'
  | 'tour.prev'
  | 'tour.finish'
  | 'tour.skip'
  | 'tour.close'
  | 'tour.label'
  | 'splitter.label'
  | 'contextMenu.label'
  | 'timePicker.placeholder'
  | 'timePicker.label'
  | 'timePicker.hour'
  | 'timePicker.minute'
  | 'timePicker.second'
  | 'treeSelect.label'
  | 'layout.collapse'
  | 'layout.expand'
  | 'empty.description'
  | 'list.empty'
  | 'table.emptyText'
  | 'cascader.placeholder'
  | 'cascader.loading'
  | 'cascader.leafTag'
  | 'cascader.panel'
  | 'cascader.level'
  | 'calendar.prevMonth'
  | 'calendar.nextMonth'
  | 'calendar.title'
  | 'datePicker.separator'
  | 'datePicker.selectedCount'
  | 'datePicker.panel'
  | 'datePicker.panelRange'
  | 'datePicker.panelMultiple'
  | 'dialog.panel'
  | 'form.required'
  | 'form.pattern'
  | 'form.invalid'
  | 'carousel.prev'
  | 'carousel.next'
  | 'carousel.indicator'
  | 'colorPicker.pick'
  | 'inputPassword.show'
  | 'inputPassword.hide'
  | 'pagination.prev'
  | 'pagination.next'
  | 'pagination.pageSize'
  | 'pagination.total'
  | 'popconfirm.confirmText'
  | 'popconfirm.cancelText'
  | 'search.placeholder'
  | 'search.action'
  | 'transfer.filterPlaceholder'
  | 'transfer.noMatch'
  | 'transfer.prevPage'
  | 'transfer.nextPage'
  | 'upload.chooseFile'
  | 'upload.remove'
  | 'upload.uploading'
  | 'upload.uploaded'
  | 'upload.failed'
