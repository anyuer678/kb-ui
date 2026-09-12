<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox as KbCheckbox } from '../Checkbox'
import { Pagination as KbPagination } from '../Pagination'

defineOptions({ name: 'KbTable' })

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  /** 是否可排序；'custom' 表示只派发 sort-change，由使用方自行排序（服务端排序） */
  sortable?: boolean | 'custom'
  /** 固定列，需配合 width 使用 */
  fixed?: 'left' | 'right'
  /** 单元格对齐方式 */
  align?: 'left' | 'center' | 'right'
}

export interface TableProps {
  data: Record<string, unknown>[]
  columns: TableColumn[]
  stripe?: boolean
  border?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 行唯一键字段名（默认用行索引） */
  rowKey?: string
  /** 分页：每页条数（0=不分页） */
  pageSize?: number
  /** 分页：当前页（1-based） */
  currentPage?: number
  /** 分页：总条数；传入即视为服务端分页——data 只放当前页数据，组件不再二次切片 */
  total?: number
  /** 是否显示行选择列 */
  selection?: boolean
  /** 已选行的 key，配合 v-model:selectedKeys */
  selectedKeys?: (string | number)[]
  /** 数据为空时的文案 */
  emptyText?: string
}

const props = withDefaults(defineProps<TableProps>(), {
  stripe: false,
  border: false,
  size: 'default',
  rowKey: undefined,
  pageSize: 0,
  currentPage: 1,
  total: undefined,
  selection: false,
  selectedKeys: () => [],
  emptyText: '暂无数据',
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'sort-change': [prop: string, order: 'asc' | 'desc' | null]
  'update:selectedKeys': [keys: (string | number)[]]
  'selection-change': [keys: (string | number)[]]
}>()

const SELECTION_WIDTH = 44

// ---- 排序 ----
const sortProp = ref<string>('')
const sortOrder = ref<'asc' | 'desc' | null>(null)

const sortConfig = computed(() => props.columns.find((c) => c.prop === sortProp.value))

function toggleSort(column: TableColumn) {
  if (!column.sortable) return
  if (sortProp.value === column.prop) {
    // 三态切换：asc → desc → 无
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? null : 'asc'
    if (sortOrder.value === null) {
      sortProp.value = ''
    }
  } else {
    sortProp.value = column.prop
    sortOrder.value = 'asc'
  }
  emit('sort-change', sortProp.value, sortOrder.value)
}

function sortIndicator(column: TableColumn): string {
  if (!column.sortable || sortProp.value !== column.prop) return ''
  return sortOrder.value === 'asc' ? ' ↑' : ' ↓'
}

// ---- 数据处理（排序 + 分页）----
const sortedData = computed(() => {
  const result = [...props.data]
  // sortable: 'custom' 交由使用方排序，组件不干预
  if (!sortProp.value || !sortOrder.value || sortConfig.value?.sortable === 'custom') return result
  const prop = sortProp.value
  const order = sortOrder.value
  result.sort((a, b) => {
    const va = a[prop] ?? ''
    const vb = b[prop] ?? ''
    const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true })
    return order === 'asc' ? cmp : -cmp
  })
  return result
})

function keyOf(row: Record<string, unknown>, index: number): string | number {
  if (!props.rowKey) return index
  const key = row[props.rowKey]
  return typeof key === 'string' || typeof key === 'number' ? key : index
}

const keyedRows = computed(() =>
  sortedData.value.map((row, index) => ({ row, index, key: keyOf(row, index) })),
)

/** 服务端分页：传入 total 后 data 即为当前页数据，组件不再二次切片 */
const serverSide = computed(() => props.total !== undefined)

const totalCount = computed(() => props.total ?? keyedRows.value.length)

const totalPages = computed(() =>
  props.pageSize > 0 ? Math.max(1, Math.ceil(totalCount.value / props.pageSize)) : 1,
)

/** 数据变少时 currentPage 可能越界，按最后一页展示，避免空白页 */
const safePage = computed(() => Math.min(Math.max(1, props.currentPage), totalPages.value))

const pageRows = computed(() => {
  // 服务端分页时 data 已经是当前页，直接使用
  if (serverSide.value || props.pageSize <= 0) return keyedRows.value
  const start = (safePage.value - 1) * props.pageSize
  return keyedRows.value.slice(start, start + props.pageSize)
})

const colSpan = computed(() => props.columns.length + (props.selection ? 1 : 0))

// ---- 行选择（全选作用于当前页）----
const selectedSet = computed(() => new Set((props.selectedKeys ?? []).map((key) => String(key))))

function isSelected(key: string | number): boolean {
  return selectedSet.value.has(String(key))
}

const selectedOnPage = computed(() => pageRows.value.filter((item) => isSelected(item.key)))
const allSelected = computed(
  () => pageRows.value.length > 0 && selectedOnPage.value.length === pageRows.value.length,
)
const someSelected = computed(() => selectedOnPage.value.length > 0 && !allSelected.value)

function commitSelection(keys: (string | number)[]) {
  emit('update:selectedKeys', keys)
  emit('selection-change', keys)
}

function toggleRow(key: string | number) {
  const next = (props.selectedKeys ?? []).filter((item) => String(item) !== String(key))
  if (!isSelected(key)) next.push(key)
  commitSelection(next)
}

function toggleAll() {
  const pageKeys = pageRows.value.map((item) => item.key)
  if (allSelected.value) {
    commitSelection(
      (props.selectedKeys ?? []).filter((item) => !pageKeys.some((pk) => String(pk) === String(item))),
    )
    return
  }
  const merged = [...(props.selectedKeys ?? [])]
  pageKeys.forEach((key) => {
    if (!merged.some((mk) => String(mk) === String(key))) merged.push(key)
  })
  commitSelection(merged)
}

// ---- 固定列 ----
function pxWidth(column: TableColumn): number {
  if (typeof column.width === 'number') return column.width
  if (typeof column.width === 'string' && column.width.endsWith('px')) {
    return Number.parseFloat(column.width)
  }
  return 0
}

const hasFixedColumn = computed(() => props.columns.some((column) => column.fixed))

const leftOffsetMap = computed(() => {
  const map = new Map<string, number>()
  let offset = props.selection ? SELECTION_WIDTH : 0
  for (const column of props.columns) {
    if (column.fixed !== 'left') continue
    map.set(column.prop, offset)
    offset += pxWidth(column)
  }
  return map
})

const rightOffsetMap = computed(() => {
  const map = new Map<string, number>()
  let offset = 0
  for (let i = props.columns.length - 1; i >= 0; i -= 1) {
    const column = props.columns[i]
    if (column.fixed !== 'right') continue
    map.set(column.prop, offset)
    offset += pxWidth(column)
  }
  return map
})

const lastLeftProp = computed(() => [...props.columns].reverse().find((c) => c.fixed === 'left')?.prop)
const firstRightProp = computed(() => props.columns.find((c) => c.fixed === 'right')?.prop)

function cellStyle(column: TableColumn): Record<string, string> {
  const style: Record<string, string> = {}
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  if (column.align) style.textAlign = column.align
  if (column.fixed === 'left') style.left = `${leftOffsetMap.value.get(column.prop) ?? 0}px`
  if (column.fixed === 'right') style.right = `${rightOffsetMap.value.get(column.prop) ?? 0}px`
  return style
}

function cellClasses(column: TableColumn): (string | false)[] {
  return [
    column.fixed === 'left' && 'kb-table__cell--fixed-left',
    column.fixed === 'right' && 'kb-table__cell--fixed-right',
    column.fixed === 'left' && column.prop === lastLeftProp.value && 'kb-table__cell--fixed-left-last',
    column.fixed === 'right' && column.prop === firstRightProp.value && 'kb-table__cell--fixed-right-first',
  ]
}

const classes = computed(() => [
  'kb-table',
  {
    'kb-table--stripe': props.stripe,
    'kb-table--border': props.border,
    'kb-table--small': props.size === 'small',
    'kb-table--large': props.size === 'large',
    'kb-table--fixed-cols': hasFixedColumn.value,
  },
])

const selectionCellStyle = { width: `${SELECTION_WIDTH}px`, left: '0px' }
</script>

<template>
  <div :class="['kb-table__wrapper', { 'kb-table__wrapper--scroll': hasFixedColumn }]">
    <table :class="classes">
      <thead>
        <tr>
          <th
            v-if="selection"
            class="kb-table__cell--selection kb-table__cell--fixed-left kb-table__cell--fixed-left-last"
            :style="selectionCellStyle"
          >
            <KbCheckbox
              :model-value="allSelected"
              :indeterminate="someSelected"
              @update:model-value="toggleAll"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.prop"
            :style="cellStyle(column)"
            :class="[{ 'kb-table__th--sortable': !!column.sortable }, cellClasses(column)]"
            @click="toggleSort(column)"
          >
            {{ column.label }}{{ sortIndicator(column) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in pageRows"
          :key="item.key"
          :class="{ 'kb-table__row--selected': selection && isSelected(item.key) }"
        >
          <td
            v-if="selection"
            class="kb-table__cell--selection kb-table__cell--fixed-left"
            :style="selectionCellStyle"
          >
            <KbCheckbox :model-value="isSelected(item.key)" @update:model-value="toggleRow(item.key)" />
          </td>
          <td
            v-for="column in columns"
            :key="column.prop"
            :style="cellStyle(column)"
            :class="cellClasses(column)"
          >
            <slot name="cell" :row="item.row" :column="column" :index="item.index">
              {{ item.row[column.prop] }}
            </slot>
          </td>
        </tr>
        <tr v-if="pageRows.length === 0">
          <td class="kb-table__empty" :colspan="colSpan">{{ emptyText }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="pageSize > 0 && totalPages > 1" class="kb-table__pagination">
      <KbPagination
        :total="totalCount"
        :page-size="pageSize"
        :current-page="safePage"
        @update:current-page="emit('update:currentPage', $event)"
      />
    </div>
  </div>
</template>
