<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbTooltip' })

export interface TooltipProps {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  disabled?: boolean
}

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  disabled: false,
})

const visible = ref(false)

const classes = computed(() => [
  'kb-tooltip__popper',
  `kb-tooltip__popper--${props.placement}`,
])

function show() {
  if (!props.disabled) visible.value = true
}

function hide() {
  visible.value = false
}

function handleClick() {
  if (props.disabled) return
  visible.value = !visible.value
}
</script>

<template>
  <span
    class="kb-tooltip"
    @mouseenter="trigger === 'hover' && show()"
    @mouseleave="trigger === 'hover' && hide()"
    @click="trigger === 'click' && handleClick()"
  >
    <slot />
    <div v-if="visible" :class="classes" role="tooltip">
      {{ content }}
    </div>
  </span>
</template>
