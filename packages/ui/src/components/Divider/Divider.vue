<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbDivider' })

export interface DividerProps {
  direction?: 'horizontal' | 'vertical'
  contentPosition?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<DividerProps>(), {
  direction: 'horizontal',
  contentPosition: 'center',
})

const classes = computed(() => [
  'kb-divider',
  `kb-divider--${props.direction}`,
  props.direction === 'horizontal' ? `kb-divider--content-${props.contentPosition}` : '',
])
</script>

<template>
  <div :class="classes" role="separator">
    <span v-if="direction === 'horizontal' && $slots.default" class="kb-divider__text">
      <slot />
    </span>
  </div>
</template>
