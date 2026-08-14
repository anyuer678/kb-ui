<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbSkeleton' })

export interface SkeletonProps {
  /** 骨架行数 */
  rows?: number
  /** 是否显示动画 */
  animated?: boolean
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  rows: 3,
  animated: true,
})

const classes = computed(() => [
  'kb-skeleton',
  { 'kb-skeleton--animated': props.animated },
])
</script>

<template>
  <div v-if="!$slots.default" :class="classes">
    <div v-for="i in rows" :key="i" class="kb-skeleton__item" />
  </div>
  <slot v-else />
</template>
