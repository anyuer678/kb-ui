<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({ name: 'KbBadge' })

export interface BadgeProps {
  /** 角标内容（数字超过 max 时封顶） */
  content?: string | number
  /** 小红点模式 */
  dot?: boolean
  /** 数字封顶值 */
  max?: number
  /** 自定义背景色 */
  color?: string
}

const props = withDefaults(defineProps<BadgeProps>(), {
  content: '',
  dot: false,
  max: 99,
  color: undefined,
})

const slots = useSlots()
const hasSlot = computed(() => Boolean(slots.default))

const displayText = computed(() => {
  if (props.dot) return ''
  const num = Number(props.content)
  if (!Number.isNaN(num) && num > props.max) return `${props.max}+`
  return String(props.content)
})

const classes = computed(() => [
  'kb-badge',
  { 'kb-badge--independent': !hasSlot.value },
])

const contentStyle = computed(() => (props.color ? { background: props.color } : undefined))
</script>

<template>
  <span :class="classes">
    <slot />
    <span
      class="kb-badge__content"
      :class="{ 'kb-badge__content--dot': dot }"
      :style="contentStyle"
    >
      {{ displayText }}
    </span>
  </span>
</template>
