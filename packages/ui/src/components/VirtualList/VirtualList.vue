<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import type { VirtualListProps } from './types'

defineOptions({ name: 'KbVirtualList' })

const props = withDefaults(defineProps<VirtualListProps<T>>(), {
  items: () => [],
  buffer: 4,
  reachEndThreshold: 8,
})

const emit = defineEmits<{
  /** 滚动位置变化 */
  scroll: [scrollTop: number]
  /** 滚动到底部 */
  reachEnd: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)

/** 可视高度：优先实测，测不到（SSR / jsdom）时回退到 props.height */
const viewportHeight = computed(() => containerRef.value?.clientHeight || props.height || 0)

const totalHeight = computed(() => props.items.length * (props.itemHeight || 0))

/** 视口内可容纳的项数 + 上下缓冲区 */
const visibleCount = computed(
  () => Math.ceil(viewportHeight.value / (props.itemHeight || 1)) + props.buffer * 2,
)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer),
)

const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value),
)

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value).map((item, i) => ({
    item,
    index: startIndex.value + i,
  })),
)

/** 内容区整体偏移量，使其对齐到滚动位置 */
const offsetY = computed(() => startIndex.value * (props.itemHeight || 0))

function handleScroll(): void {
  const el = containerRef.value
  if (!el) return
  scrollTop.value = el.scrollTop
  emit('scroll', el.scrollTop)

  const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - props.reachEndThreshold
  if (reachedBottom) emit('reachEnd')
}
</script>

<template>
  <div
    ref="containerRef"
    class="kb-virtual-list"
    :style="{ height: `${height}px` }"
    role="list"
    @scroll="handleScroll"
  >
    <div class="kb-virtual-list__phantom" :style="{ height: `${totalHeight}px` }">
      <div class="kb-virtual-list__content" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="entry in visibleItems"
          :key="entry.index"
          class="kb-virtual-list__item"
          role="listitem"
          :style="{ height: `${itemHeight}px` }"
        >
          <slot name="item" :item="entry.item" :index="entry.index" />
        </div>
      </div>
    </div>
    <div v-if="items.length === 0" class="kb-virtual-list__empty">
      <slot name="empty">暂无数据</slot>
    </div>
  </div>
</template>
