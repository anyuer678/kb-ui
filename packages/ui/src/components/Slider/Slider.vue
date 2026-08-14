<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbSlider' })

export interface SliderProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const clamped = computed(() => Math.min(props.max, Math.max(props.min, props.modelValue)))
const percent = computed(() => ((clamped.value - props.min) / (props.max - props.min)) * 100)

function updateFromEvent(event: MouseEvent) {
  if (props.disabled) return
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const raw = props.min + ratio * (props.max - props.min)
  const stepped = Math.round(raw / props.step) * props.step
  emit('update:modelValue', Math.min(props.max, Math.max(props.min, stepped)))
}
</script>

<template>
  <div
    class="kb-slider"
    :class="{ 'kb-slider--disabled': disabled }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="clamped"
    @click="updateFromEvent"
  >
    <div class="kb-slider__track">
      <div class="kb-slider__fill" :style="{ width: `${percent}%` }" />
      <div class="kb-slider__handle" :style="{ left: `${percent}%` }" />
    </div>
  </div>
</template>
