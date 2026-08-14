<script setup lang="ts">
defineOptions({ name: 'KbColorPicker' })

export interface ColorPickerProps {
  modelValue?: string
}

withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
]

function select(color: string) {
  emit('update:modelValue', color)
}
</script>

<template>
  <div class="kb-colorpicker">
    <span class="kb-colorpicker__value" :style="{ background: modelValue || '#fff' }" />
    <div class="kb-colorpicker__presets">
      <button
        v-for="color in PRESET_COLORS"
        :key="color"
        class="kb-colorpicker__swatch"
        :class="{ 'kb-colorpicker__swatch--active': modelValue === color }"
        type="button"
        :style="{ background: color }"
        :aria-label="`选择颜色 ${color}`"
        @click="select(color)"
      />
    </div>
  </div>
</template>
