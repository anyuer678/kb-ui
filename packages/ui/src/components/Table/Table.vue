<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbTable' })

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  /** 是否可排序 */
  sortable?: boolean
}

export interface TableProps {
  data: Record<string, unknown>[]
  columns: TableColumn[]
  stripe?: boolean
  border?: boolean
  /** 行唯一键字段名（默认用行索引） */
  rowKey?: string
  /** 分页：每页条数（0=不分页） */
  pageSize?: number
  /** 分页：当前页（1-based） */
  currentPage?: number
}

const props = withDefaults(defineProps<TableProps>(), {
  stripe: false,
  border: false,
  rowKey: undefined,
  pageSize: 0,
  currentPage: 1,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'sort-change': [prop: string, order: 'asc' | 'desc' | null]
}>()

// ---- 排序 ----
const sortProp = ref<string>('')
const sortOrder = ref<'asc' | 'desc' | null>(null)

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
const processedData = computed(() => {
  let result = [...props.data]

  // 排序
  if (sortProp.value && sortOrder.value) {
    const prop = sortProp.value
    const order = sortOrder.value
    result.sort((a, b) => {
      const va = a[prop] ?? ''
      const vb = b[prop] ?? ''
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true })
      return order === 'asc' ? cmp : -cmp
    })
  }

  return result
})

const displayData = computed(() => {
  if (props.pageSize <= 0) return processedData.value
  const start = (props.currentPage - 1) * props.pageSize
  return processedData.value.slice(start, start + props.pageSize)
})

const totalPages = computed(() => {
  if (props.pageSize <= 0) return 1
  return Math.max(1, Math.ceil(props.data.length / props.pageSize))
})

// ---- 行键 ----
function rowKeyOf(row: Record<string, unknown>, rowIndex: number): string {
  return props.rowKey ? String(row[props.rowKey]) : String(rowIndex)
}

const classes = computed(() => [
  'kb-table',
  {
    'kb-table--stripe': props.stripe,
    'kb-table--border': props.border,
  },
])

function columnWidth(column: TableColumn) {
  if (!column.width) return undefined
  return { width: typeof column.width === 'number' ? `${column.width}px` : column.width }
}
</script>

<template>
  <div>
    <table :class="classes">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.prop"
            :style="columnWidth(column)"
            :class="{ 'kb-table__th--sortable': column.sortable }"
            @click="toggleSort(column)"
          >
            {{ column.label }}{{ sortIndicator(column) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in displayData" :key="rowKeyOf(row, rowIndex)">
          <td v-for="column in columns" :key="column.prop">
            <slot name="cell" :row="row" :column="column" :index="rowIndex">
              {{ row[column.prop] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="pageSize > 0 && totalPages > 1" class="kb-table__pagination">
      <span class="kb-table__pagination-info">共 {{ data.length }} 条，{{ totalPages }} 页</span>
      <button class="kb-btn kb-btn--small" :disabled="currentPage <= 1" @click="emit('update:currentPage', currentPage - 1)">上一页</button>
      <span class="kb-table__pagination-current">{{ currentPage }} / {{ totalPages }}</span>
      <button class="kb-btn kb-btn--small" :disabled="currentPage >= totalPages" @click="emit('update:currentPage', currentPage + 1)">下一页</button>
    </div>
  </div>
</template>
