<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbInputNumber' })

export interface InputNumberProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: 0,
  min: undefined,
  max: undefined,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const display = computed(() => String(props.modelValue))

function clamp(value: number): number {
  let next = value
  if (props.min !== undefined) next = Math.max(props.min, next)
  if (props.max !== undefined) next = Math.min(props.max, next)
  return next
}

function stepChange(delta: number) {
  if (props.disabled) return
  const next = clamp(props.modelValue + delta * props.step)
  if (next !== props.modelValue) emit('update:modelValue', next)
}

function handleInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isNaN(value)) emit('update:modelValue', clamp(value))
}
</script>

<template>
  <div class="kb-input-number" :class="{ 'kb-input-number--disabled': disabled }">
    <button
      class="kb-input-number__step kb-input-number__step--down"
      type="button"
      :disabled="disabled || (min !== undefined && modelValue <= min)"
      @click="stepChange(-1)"
    >
      −
    </button>
    <input
      class="kb-input-number__input"
      :value="display"
      type="number"
      :disabled="disabled"
      @input="handleInput"
    />
    <button
      class="kb-input-number__step kb-input-number__step--up"
      type="button"
      :disabled="disabled || (max !== undefined && modelValue >= max)"
      @click="stepChange(1)"
    >
      +
    </button>
  </div>
</template>
