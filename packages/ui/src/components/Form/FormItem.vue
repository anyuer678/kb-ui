<script setup lang="ts">
import { computed, inject } from 'vue'
import type { FormContext } from './Form.vue'

defineOptions({ name: 'KbFormItem' })

export interface FormItemProps {
  label?: string
  /** 对应 form.model 的字段名 */
  prop?: string
}

const props = withDefaults(defineProps<FormItemProps>(), {
  label: '',
  prop: '',
})

const context = inject<FormContext | null>('kbFormContext', null)

const error = computed(() => (context && props.prop ? context.errors[props.prop] : null))

const classes = computed(() => [
  'kb-form-item',
  { 'kb-form-item--error': error.value },
])
</script>

<template>
  <div :class="classes">
    <label v-if="label" class="kb-form-item__label">{{ label }}</label>
    <div class="kb-form-item__content">
      <slot />
      <div v-if="error" class="kb-form-item__error">{{ error }}</div>
    </div>
  </div>
</template>
