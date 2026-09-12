<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

defineOptions({ name: 'KbCheckbox' })

export interface CheckboxProps {
  modelValue?: boolean
  disabled?: boolean
  label?: string
  /** 半选态（表头全选常用），仅影响视觉与 DOM，不参与 v-model */
  indeterminate?: boolean
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

// indeterminate 是 DOM 属性而非 attribute，必须直接赋值；
// 用 sync 刷新保证模板 ref 挂载后立即生效，不留一帧错误态
watchEffect(
  () => {
    if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
  },
  { flush: 'sync' },
)

const classes = computed(() => [
  'kb-checkbox',
  {
    'kb-checkbox--checked': props.modelValue,
    'kb-checkbox--disabled': props.disabled,
    'kb-checkbox--indeterminate': props.indeterminate,
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
      ref="inputRef"
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
