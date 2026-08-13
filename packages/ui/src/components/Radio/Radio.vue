<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbRadio' })

export interface RadioProps {
  modelValue?: string | number | boolean
  value: string | number | boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const classes = computed(() => [
  'kb-radio',
  {
    'kb-radio--checked': props.modelValue === props.value,
    'kb-radio--disabled': props.disabled,
  },
])

function handleChange() {
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<template>
  <label :class="classes">
    <input
      class="kb-radio__input"
      type="radio"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="kb-radio__inner" />
    <span class="kb-radio__label">
      <slot />
    </span>
  </label>
</template>
