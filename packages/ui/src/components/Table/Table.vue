<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbTable' })

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
}

export interface TableProps {
  data: Record<string, unknown>[]
  columns: TableColumn[]
  stripe?: boolean
  border?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  stripe: false,
  border: false,
})

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
  <table :class="classes">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.prop" :style="columnWidth(column)">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="column in columns" :key="column.prop">
          <slot name="cell" :row="row" :column="column" :index="rowIndex">
            {{ row[column.prop] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
