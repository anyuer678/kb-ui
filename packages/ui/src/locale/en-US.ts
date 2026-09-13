/**
 * 英文（美国）语言包
 *
 * %s 为占位符，运行时由 useLocale 的 t() 按顺序替换。
 */
import type { ProjectLocale } from './types'

export const enUS: ProjectLocale = {
  name: 'en-US',
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    loading: 'Loading…',
    noMatch: 'No matches',
    placeholder: 'Please select',
  },
  anchor: {
    label: 'Anchor navigation',
  },
  backTop: {
    label: 'Back to top',
  },
  image: {
    loadFailed: 'Load failed',
    preview: 'Preview image',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    rotate: 'Rotate',
    prev: 'Previous image',
    next: 'Next image',
  },
  tour: {
    next: 'Next',
    prev: 'Previous',
    finish: 'Finish',
    skip: 'Skip',
    close: 'Close tour',
  },
  timePicker: {
    placeholder: 'Please select time',
  },
  empty: {
    description: 'No data',
  },
  list: {
    empty: 'No data',
  },
  table: {
    emptyText: 'No data',
  },
  cascader: {
    placeholder: 'Please select',
    loading: 'Loading…',
    leafTag: 'Selectable',
    panel: 'Cascader panel',
    level: 'Level %s',
  },
  calendar: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    title: '%s/%s',
    weekShorts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  datePicker: {
    separator: ' ~ ',
    selectedCount: '%s dates selected',
    panel: 'Select date',
    panelRange: 'Select date range',
    panelMultiple: 'Select dates',
  },
  dialog: {
    panel: 'Dialog',
  },
  form: {
    required: '%s is required',
    pattern: '%s is malformed',
    invalid: '%s is invalid',
  },
  carousel: {
    prev: 'Previous slide',
    next: 'Next slide',
    indicator: 'Slide %s',
  },
  colorPicker: {
    pick: 'Pick color %s',
  },
  inputPassword: {
    show: 'Show password',
    hide: 'Hide password',
  },
  pagination: {
    prev: 'Previous page',
    next: 'Next page',
    pageSize: '%s / page',
    total: '%s items',
  },
  popconfirm: {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  },
  search: {
    placeholder: 'Search…',
    action: 'Search',
  },
  transfer: {
    titles: ['Source', 'Target'],
    filterPlaceholder: 'Search',
    noMatch: 'No matches',
    prevPage: 'Previous page',
    nextPage: 'Next page',
  },
  upload: {
    chooseFile: 'Choose file',
    remove: 'Remove',
    uploading: 'Uploading %s%',
    uploaded: 'Uploaded',
    failed: 'Upload failed',
  },
}
