<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'

defineOptions({ name: 'KbCol' })

export interface ColProps {
  span?: number
  offset?: number
}

const props = withDefaults(defineProps<ColProps>(), {
  span: 24,
  offset: 0,
})

const gutter = inject<ComputedRef<number>>('kbRowGutter', computed(() => 0))

const classes = computed(() => [
  'kb-col',
  `kb-col-${props.span}`,
  props.offset ? `kb-col-offset-${props.offset}` : '',
])

const paddingStyle = computed(() => {
  if (!gutter.value) return undefined
  const half = `${gutter.value / 2}px`
  return { paddingLeft: half, paddingRight: half }
})
</script>

<template>
  <div :class="classes" :style="paddingStyle">
    <slot />
  </div>
</template>
