<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbForm' })

const { t } = useLocale()

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
      return rule.message ?? t('form.required', prop)
    }
    if (rule.pattern && !rule.pattern.test(String(value ?? ''))) {
      return rule.message ?? t('form.pattern', prop)
    }
    if (rule.validator && !rule.validator(value)) {
      return rule.message ?? t('form.invalid', prop)
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
