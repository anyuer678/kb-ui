<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '../Calendar'

defineOptions({ name: 'KbDatePicker' })

export interface DatePickerProps {
  modelValue?: string
  placeholder?: string
}

withDefaults(defineProps<DatePickerProps>(), {
  modelValue: '',
  placeholder: '选择日期',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function onSelect(date: string) {
  emit('update:modelValue', date)
  open.value = false
}
</script>

<template>
  <div class="kb-datepicker">
    <input
      class="kb-datepicker__input"
      :value="modelValue"
      :placeholder="placeholder"
      readonly
      @click="toggle"
    />
    <div v-if="open" class="kb-datepicker__panel">
      <Calendar :model-value="modelValue" @update:model-value="onSelect" />
    </div>
  </div>
</template>
