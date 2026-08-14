<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbLoading' })

export interface LoadingProps {
  /** 指示器尺寸（px） */
  size?: number
  /** 提示文字 */
  text?: string
}

const props = withDefaults(defineProps<LoadingProps>(), {
  size: 24,
  text: '',
})

const spinnerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderWidth: `${Math.max(2, props.size / 8)}px`,
}))
</script>

<template>
  <div class="kb-loading" role="status">
    <span class="kb-loading__spinner" :style="spinnerStyle" />
    <span v-if="text" class="kb-loading__text">{{ text }}</span>
  </div>
</template>
