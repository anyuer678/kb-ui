<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbPagination' })

export interface PaginationProps {
  total: number
  pageSize?: number
  currentPage?: number
  /** 页码窗口大小 */
  pagerCount?: number
}

const props = withDefaults(defineProps<PaginationProps>(), {
  pageSize: 10,
  currentPage: 1,
  pagerCount: 7,
})

const emit = defineEmits<{ 'update:currentPage': [value: number] }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const current = computed(() => Math.min(props.currentPage, pageCount.value))

/** 页码窗口（含省略号逻辑：显示 1, ..., 窗口, ..., 末页） */
const pagerItems = computed<(number | 'prev-more' | 'next-more')[]>(() => {
  const count = pageCount.value
  if (count <= props.pagerCount) {
    return Array.from({ length: count }, (_, i) => i + 1)
  }
  const half = Math.floor(props.pagerCount / 2)
  let start = Math.max(1, current.value - half)
  let end = Math.min(count, start + props.pagerCount - 1)
  start = Math.max(1, end - props.pagerCount + 1)
  const items: (number | 'prev-more' | 'next-more')[] = []
  if (start > 1) {
    items.push(1)
    if (start > 2) items.push('prev-more')
  }
  for (let i = start; i <= end; i++) items.push(i)
  if (end < count) {
    if (end < count - 1) items.push('next-more')
    items.push(count)
  }
  return items
})

function go(page: number) {
  const next = Math.min(pageCount.value, Math.max(1, page))
  if (next === current.value) return
  emit('update:currentPage', next)
}

function jump(direction: 'prev' | 'next') {
  go(direction === 'prev' ? current.value - 1 : current.value + 1)
}
</script>

<template>
  <nav class="kb-pagination" aria-label="Pagination">
    <span class="kb-pagination__total">共 {{ total }} 条</span>
    <button
      class="kb-pagination__prev"
      type="button"
      :disabled="current <= 1"
      aria-label="上一页"
      @click="jump('prev')"
    >
      ‹
    </button>
    <template v-for="(item, index) in pagerItems" :key="index">
      <button
        v-if="typeof item === 'number'"
        class="kb-pagination__item"
        :class="{ 'kb-pagination__item--active': item === current }"
        type="button"
        @click="go(item)"
      >
        {{ item }}
      </button>
      <span v-else class="kb-pagination__more">…</span>
    </template>
    <button
      class="kb-pagination__next"
      type="button"
      :disabled="current >= pageCount"
      aria-label="下一页"
      @click="jump('next')"
    >
      ›
    </button>
  </nav>
</template>
