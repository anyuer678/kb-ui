<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbMessage' })

export interface MessageProps {
  type?: 'success' | 'error' | 'info' | 'warning'
  content?: string
}

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  content: '',
})

const ICON_NAMES: Record<string, string> = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
}

const iconName = computed(() => ICON_NAMES[props.type])
</script>

<template>
  <div class="kb-message" :class="`kb-message--${type}`" role="status">
    <Icon :name="iconName" :size="16" />
    <span class="kb-message__content">{{ content }}</span>
  </div>
</template>
