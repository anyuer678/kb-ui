<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbResult' })

export interface ResultProps {
  status?: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
}

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'success',
  description: '',
})

const ICON_NAMES: Record<string, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const iconClasses = computed(() => ['kb-result__icon', `kb-result__icon--${props.status}`])
</script>

<template>
  <div class="kb-result">
    <Icon :name="ICON_NAMES[status]" :size="64" :class="iconClasses" />
    <h3 class="kb-result__title">{{ title }}</h3>
    <p v-if="description" class="kb-result__description">{{ description }}</p>
    <div v-if="$slots.action" class="kb-result__action">
      <slot name="action" />
    </div>
  </div>
</template>
