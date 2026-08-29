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
const panelId = `kb-popover-${Math.random().toString(36).slice(2, 8)}`

function toggle() {
  open.value = !open.value
}

function handleKeydown(event: KeyboardEvent) {
  // 仅 click 触发模式支持键盘操作；hover 模式为纯悬浮提示
  if (props.trigger !== 'click') return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    open.value = false
  }
}
</script>

<template>
  <span
    class="kb-popover"
    :tabindex="trigger === 'click' ? 0 : undefined"
    role="button"
    :aria-expanded="trigger === 'click' ? open : undefined"
    :aria-describedby="open ? panelId : undefined"
    @mouseenter="trigger === 'hover' && (open = true)"
    @mouseleave="trigger === 'hover' && (open = false)"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <slot />
    <div
      v-if="open"
      :id="panelId"
      class="kb-popover__panel"
      :class="`kb-popover__panel--${placement}`"
      :role="trigger === 'click' ? 'dialog' : 'tooltip'"
    >
      <div v-if="title" class="kb-popover__title">{{ title }}</div>
      <div class="kb-popover__content">{{ content }}</div>
      <slot name="extra" />
    </div>
  </span>
</template>
