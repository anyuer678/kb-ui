<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbCard' })

export interface CardProps {
  title?: string
  /** 阴影：always / hover / never */
  shadow?: 'always' | 'hover' | 'never'
}

const props = withDefaults(defineProps<CardProps>(), {
  title: '',
  shadow: 'always',
})

const classes = computed(() => ['kb-card', `kb-card--shadow-${props.shadow}`])
</script>

<template>
  <div :class="classes">
    <header v-if="title" class="kb-card__header">{{ title }}</header>
    <div class="kb-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="kb-card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
