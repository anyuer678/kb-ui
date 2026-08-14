<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbRate' })

export interface RateProps {
  modelValue?: number
  /** 星星总数 */
  max?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  max: 5,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

function select(index: number) {
  if (props.disabled) return
  emit('update:modelValue', index)
}
</script>

<template>
  <div class="kb-rate">
    <span
      v-for="star in stars"
      :key="star"
      class="kb-rate__star"
      :class="{ 'kb-rate__star--active': star <= modelValue }"
      role="radio"
      :aria-checked="star <= modelValue"
      @click="select(star)"
    >
      ★
    </span>
  </div>
</template>
