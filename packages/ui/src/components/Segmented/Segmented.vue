<script setup lang="ts">
defineOptions({ name: 'KbSegmented' })

export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SegmentedProps {
  options: SegmentedOption[]
  modelValue?: string | number
}

withDefaults(defineProps<SegmentedProps>(), {
  options: () => [],
  modelValue: undefined,
})

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

function select(option: SegmentedOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
}
</script>

<template>
  <div class="kb-segmented">
    <div
      v-for="option in options"
      :key="option.value"
      class="kb-segmented__item"
      :class="{
        'kb-segmented__item--active': option.value === modelValue,
        'kb-segmented__item--disabled': option.disabled,
      }"
      role="tab"
      :aria-selected="option.value === modelValue"
      @click="select(option)"
    >
      {{ option.label }}
    </div>
  </div>
</template>
