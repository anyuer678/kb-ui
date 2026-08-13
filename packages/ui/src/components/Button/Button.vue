<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbButton' })

export interface ButtonProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  round?: boolean
  plain?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  round: false,
  plain: false,
  nativeType: 'button',
})

defineEmits<{ click: [event: MouseEvent] }>()

const classes = computed(() => [
  'kb-button',
  `kb-button--${props.type}`,
  `kb-button--${props.size}`,
  {
    'kb-button--disabled': props.disabled,
    'kb-button--round': props.round,
    'kb-button--plain': props.plain,
  },
])
</script>

<template>
  <button
    :type="nativeType"
    :class="classes"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
