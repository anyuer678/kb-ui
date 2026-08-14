<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'KbCountUp' })

export interface CountUpProps {
  end: number
  /** 起始值 */
  start?: number
  /** 动画时长（ms） */
  duration?: number
  prefix?: string
  suffix?: string
  /** 小数位 */
  decimals?: number
}

const props = withDefaults(defineProps<CountUpProps>(), {
  start: 0,
  duration: 1500,
  prefix: '',
  suffix: '',
  decimals: 0,
})

const display = ref(props.start)
let rafId = 0

function animate() {
  let startTime: number | null = null
  const from = props.start
  const delta = props.end - from

  const tick = (now: number) => {
    if (startTime === null) startTime = now
    const progress = Math.min(1, Math.max(0, (now - startTime) / props.duration))
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = from + delta * eased
    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      display.value = props.end
    }
  }
  rafId = requestAnimationFrame(tick)
}

onMounted(animate)
onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <span class="kb-countup">
    {{ prefix }}{{ display.toFixed(decimals) }}{{ suffix }}
  </span>
</template>
