<script setup lang="ts">
import { computed, provide, reactive } from 'vue'

defineOptions({ name: 'KbForm' })

export interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  validator?: (value: unknown) => boolean
}

export interface FormContext {
  model: Record<string, unknown>
  rules: Record<string, FormRule[]>
  errors: Record<string, string | null>
  validateField: (prop: string) => string | null
}

export interface FormProps {
  model: Record<string, unknown>
  rules?: Record<string, FormRule[]>
  labelWidth?: string
}

const props = withDefaults(defineProps<FormProps>(), {
  rules: () => ({}),
  labelWidth: '80px',
})

const errors = reactive<Record<string, string | null>>({})

function validateField(prop: string): string | null {
  const fieldRules = props.rules[prop] ?? []
  const value = props.model[prop]
  for (const rule of fieldRules) {
    if (rule.required && (value === undefined || value === null || value === '')) {
      return rule.message ?? `${prop} 为必填项`
    }
    if (rule.pattern && !rule.pattern.test(String(value ?? ''))) {
      return rule.message ?? `${prop} 格式不正确`
    }
    if (rule.validator && !rule.validator(value)) {
      return rule.message ?? `${prop} 不合法`
    }
  }
  return null
}

function validate(): Promise<boolean> {
  let allPass = true
  Object.keys(props.model).forEach((prop) => {
    const result = validateField(prop)
    errors[prop] = result
    if (result) allPass = false
  })
  return Promise.resolve(allPass)
}

const context: FormContext = { model: props.model, rules: props.rules, errors, validateField }
provide('kbFormContext', context)

const classes = computed(() => ['kb-form'])
defineExpose({ validate, validateField })
</script>

<template>
  <form :class="classes" role="form" @submit.prevent>
    <slot />
  </form>
</template>
