<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbProgress' })

export interface ProgressProps {
  /** 进度百分比 0-100（超界自动收敛） */
  percentage?: number
  /** 轨道高度（px） */
  strokeWidth?: number
  /** 自定义颜色 */
  color?: string
  /** 是否显示百分比文本 */
  showText?: boolean
  /** 状态（决定颜色） */
  status?: 'normal' | 'success' | 'warning' | 'danger'
}

const props = withDefaults(defineProps<ProgressProps>(), {
  percentage: 0,
  strokeWidth: 8,
  showText: true,
  status: 'normal',
  color: undefined,
})

const clamped = computed(() => Math.min(100, Math.max(0, props.percentage)))

const barClasses = computed(() => [
  'kb-progress__bar',
  `kb-progress__bar--${props.status}`,
])

const barStyle = computed(() => ({
  width: `${clamped.value}%`,
  height: `${props.strokeWidth}px`,
  ...(props.color ? { background: props.color } : {}),
}))
</script>

<template>
  <div class="kb-progress">
    <div class="kb-progress__track">
      <div :class="barClasses" :style="barStyle" />
    </div>
    <span v-if="showText" class="kb-progress__text">{{ clamped }}%</span>
  </div>
</template>
