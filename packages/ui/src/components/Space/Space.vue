<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbSpace' })

export interface SpaceProps {
  direction?: 'horizontal' | 'vertical'
  size?: 'small' | 'medium' | 'large' | number
  align?: 'start' | 'center' | 'end' | 'baseline'
  wrap?: boolean
}

const props = withDefaults(defineProps<SpaceProps>(), {
  direction: 'horizontal',
  size: 'medium',
  align: 'start',
  wrap: false,
})

// token 间距映射：small -> --kb-space-1, medium -> --kb-space-2, large -> --kb-space-4
const SIZE_TOKENS: Record<string, string> = {
  small: 'var(--kb-space-1)',
  medium: 'var(--kb-space-2)',
  large: 'var(--kb-space-4)',
}

const classes = computed(() => [
  'kb-space',
  `kb-space--${props.direction}`,
  `kb-space--align-${props.align}`,
  { 'kb-space--wrap': props.wrap },
])

const gapStyle = computed(() => {
  const gap = typeof props.size === 'number' ? `${props.size}px` : SIZE_TOKENS[props.size]
  return { gap }
})
</script>

<template>
  <div :class="classes" :style="gapStyle">
    <slot />
  </div>
</template>
