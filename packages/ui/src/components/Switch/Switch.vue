<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbSwitch' })

export interface SwitchProps {
  modelValue?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const classes = computed(() => [
  'kb-switch',
  {
    'kb-switch--checked': props.modelValue,
    'kb-switch--disabled': props.disabled,
  },
])

function handleClick() {
  if (props.disabled) return
  const value = !props.modelValue
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <button
    :class="classes"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="kb-switch__dot" />
  </button>
</template>
