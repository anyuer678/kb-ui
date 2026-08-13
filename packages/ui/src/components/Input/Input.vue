<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbInput' })

export interface InputProps {
  modelValue?: string
  type?: 'text' | 'password' | 'number'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  clearable: false,
  size: 'medium',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const focused = ref(false)

const classes = computed(() => [
  'kb-input',
  `kb-input--${props.size}`,
  {
    'kb-input--disabled': props.disabled,
    'kb-input--focused': focused.value,
    'kb-input--clearable': props.clearable,
  },
])

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

function handleChange(event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div :class="classes">
    <input
      class="kb-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @focus="focused = true; $emit('focus', $event)"
      @blur="focused = false; $emit('blur', $event)"
    />
    <button
      v-if="clearable && modelValue && !disabled"
      class="kb-input__clear"
      type="button"
      aria-label="clear"
      @click="emit('update:modelValue', '')"
    >
      ×
    </button>
  </div>
</template>
