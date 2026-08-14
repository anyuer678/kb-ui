<script setup lang="ts">
import { computed, provide } from 'vue'
import { ROW_GUTTER_KEY } from './constants'

defineOptions({ name: 'KbRow' })

export interface RowProps {
  gutter?: number
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  align?: 'top' | 'middle' | 'bottom'
}

const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
})

provide(ROW_GUTTER_KEY, computed(() => props.gutter))

const classes = computed(() => [
  'kb-row',
  `kb-row--${props.justify}`,
  `kb-row--align-${props.align}`,
])

const gutterStyle = computed(() => {
  if (!props.gutter) return undefined
  const half = `${props.gutter / 2}px`
  return { marginLeft: `-${half}`, marginRight: `-${half}` }
})
</script>

<template>
  <div :class="classes" :style="gutterStyle">
    <slot />
  </div>
</template>
