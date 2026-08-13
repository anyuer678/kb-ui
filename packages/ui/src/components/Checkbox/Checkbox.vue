<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbCheckbox' })

export interface CheckboxProps {
  modelValue?: boolean
  disabled?: boolean
  label?: string
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const classes = computed(() => [
  'kb-checkbox',
  {
    'kb-checkbox--checked': props.modelValue,
    'kb-checkbox--disabled': props.disabled,
  },
])

function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).checked
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <label :class="classes">
    <input
      class="kb-checkbox__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="kb-checkbox__inner" />
    <span v-if="label || $slots.default" class="kb-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
