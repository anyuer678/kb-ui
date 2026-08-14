<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbTextarea' })

export interface TextareaProps {
  modelValue?: string
  placeholder?: string
  rows?: number
  maxlength?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  placeholder: '',
  rows: 3,
  maxlength: undefined,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const length = computed(() => props.modelValue.length)
const showCount = computed(() => props.maxlength !== undefined)

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="kb-textarea" :class="{ 'kb-textarea--disabled': disabled }">
    <textarea
      class="kb-textarea__inner"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      :disabled="disabled"
      @input="handleInput"
    />
    <div v-if="showCount" class="kb-textarea__count">{{ length }}/{{ maxlength }}</div>
  </div>
</template>
