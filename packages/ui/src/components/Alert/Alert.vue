<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbAlert' })

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  /** 是否可关闭 */
  closable?: boolean
  /** 是否显示类型图标 */
  showIcon?: boolean
}

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  title: '',
  closable: false,
  showIcon: false,
})

const visible = ref(true)

const ICON_NAMES: Record<string, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const classes = computed(() => [
  'kb-alert',
  `kb-alert--${props.type}`,
  { 'kb-alert--hidden': !visible.value },
])

function close() {
  visible.value = false
}
</script>

<template>
  <div v-if="visible" :class="classes" role="alert">
    <Icon v-if="showIcon" :name="ICON_NAMES[type]" :size="18" class="kb-alert__icon" />
    <div class="kb-alert__main">
      <div v-if="title" class="kb-alert__title">{{ title }}</div>
      <div v-if="$slots.default" class="kb-alert__content">
        <slot />
      </div>
    </div>
    <button v-if="closable" class="kb-alert__close" type="button" aria-label="close" @click="close">
      ×
    </button>
  </div>
</template>
