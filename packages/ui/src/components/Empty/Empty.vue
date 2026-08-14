<script setup lang="ts">
import { Icon } from '../Icon'

defineOptions({ name: 'KbEmpty' })

export interface EmptyProps {
  /** 空状态文案 */
  description?: string
}

withDefaults(defineProps<EmptyProps>(), {
  description: '暂无数据',
})
</script>

<template>
  <div class="kb-empty">
    <div class="kb-empty__image">
      <slot name="image">
        <Icon name="menu" :size="48" />
      </slot>
    </div>
    <p class="kb-empty__description">{{ description }}</p>
    <div v-if="$slots.action" class="kb-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>
