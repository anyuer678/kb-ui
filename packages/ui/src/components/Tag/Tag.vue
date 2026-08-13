<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbTag' })

export interface TagProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  closable?: boolean
  round?: boolean
}

const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  size: 'medium',
  closable: false,
  round: false,
})

defineEmits<{ close: [] }>()

const classes = computed(() => [
  'kb-tag',
  `kb-tag--${props.type}`,
  `kb-tag--${props.size}`,
  { 'kb-tag--round': props.round },
])
</script>

<template>
  <span :class="classes">
    <slot />
    <button
      v-if="closable"
      class="kb-tag__close"
      type="button"
      aria-label="close"
      @click="$emit('close')"
    >
      ×
    </button>
  </span>
</template>
