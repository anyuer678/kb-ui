/**
 * 简体中文语言包（默认）
 *
 * 所有文案必须与此前硬编码在各组件内的中文保持完全一致，
 * 避免升级后默认展示文案发生变化。
 */
import type { ProjectLocale } from './types'

export const zhCN: ProjectLocale = {
  name: 'zh-CN',
  common: {
    confirm: '确定',
    cancel: '取消',
    clear: '清空',
    close: '关闭',
    loading: '加载中…',
    noMatch: '无匹配数据',
    placeholder: '请选择',
  },
  anchor: {
    label: '锚点导航',
  },
  backTop: {
    label: '回到顶部',
  },
  image: {
    loadFailed: '加载失败',
    preview: '预览图片',
    zoomIn: '放大',
    zoomOut: '缩小',
    rotate: '旋转',
    prev: '上一张',
    next: '下一张',
  },
  tour: {
    next: '下一步',
    prev: '上一步',
    finish: '结束引导',
    skip: '跳过',
    close: '关闭引导',
  },
  timePicker: {
    placeholder: '请选择时间',
  },
  empty: {
    description: '暂无数据',
  },
  list: {
    empty: '暂无数据',
  },
  table: {
    emptyText: '暂无数据',
  },
  cascader: {
    placeholder: '请选择',
    loading: '加载中…',
    leafTag: '可选',
    panel: '级联选择',
    level: '第 %s 级',
  },
  calendar: {
    prevMonth: '上一月',
    nextMonth: '下一月',
    title: '%s 年 %s 月',
    weekShorts: ['一', '二', '三', '四', '五', '六', '日'],
  },
  datePicker: {
    separator: ' 至 ',
    selectedCount: '已选 %s 个日期',
    panel: '选择日期',
    panelRange: '选择日期范围',
    panelMultiple: '选择日期（可多选）',
  },
  dialog: {
    panel: '对话框',
  },
  form: {
    required: '%s 为必填项',
    pattern: '%s 格式不正确',
    invalid: '%s 不合法',
  },
  carousel: {
    prev: '上一张',
    next: '下一张',
    indicator: '第 %s 张',
  },
  colorPicker: {
    pick: '选择颜色 %s',
  },
  inputPassword: {
    show: '显示密码',
    hide: '隐藏密码',
  },
  pagination: {
    prev: '上一页',
    next: '下一页',
    pageSize: '每页 %s 条',
    total: '共 %s 条',
  },
  popconfirm: {
    confirmText: '确定',
    cancelText: '取消',
  },
  search: {
    placeholder: '搜索…',
    action: '搜索',
  },
  transfer: {
    titles: ['待选', '已选'],
    filterPlaceholder: '请输入搜索内容',
    noMatch: '无匹配数据',
    prevPage: '上一页',
    nextPage: '下一页',
  },
  upload: {
    chooseFile: '选择文件',
    remove: '删除',
    uploading: '上传中 %s%',
    uploaded: '已上传',
    failed: '上传失败',
  },
}
