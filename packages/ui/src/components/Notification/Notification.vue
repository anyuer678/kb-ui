<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbNotification' })

export interface NotificationProps {
  type?: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  message: '',
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
  <div class="kb-notification" :class="`kb-notification--${type}`" role="alert">
    <Icon :name="iconName" :size="20" class="kb-notification__icon" />
    <div class="kb-notification__main">
      <div class="kb-notification__title">{{ title }}</div>
      <div v-if="message" class="kb-notification__message">{{ message }}</div>
    </div>
  </div>
</template>
