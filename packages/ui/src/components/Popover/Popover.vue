<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'KbPopover' })

export interface PopoverProps {
  title?: string
  content?: string
  /** 触发方式 */
  trigger?: 'hover' | 'click'
  /** 位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<PopoverProps>(), {
  title: '',
  content: '',
  trigger: 'hover',
  placement: 'top',
})

const open = ref(false)

function toggle() {
  if (props.trigger === 'click') open.value = !open.value
}
</script>

<template>
  <span
    class="kb-popover"
    @mouseenter="trigger === 'hover' && (open = true)"
    @mouseleave="trigger === 'hover' && (open = false)"
    @click="toggle"
  >
    <slot />
    <div v-if="open" class="kb-popover__panel" :class="`kb-popover__panel--${placement}`">
      <div v-if="title" class="kb-popover__title">{{ title }}</div>
      <div class="kb-popover__content">{{ content }}</div>
      <slot name="extra" />
    </div>
  </span>
</template>
