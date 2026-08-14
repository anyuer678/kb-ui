<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbStatistic' })

export interface StatisticProps {
  title: string
  value: number
  /** 前缀/后缀文本 */
  prefix?: string
  suffix?: string
  /** 小数位 */
  precision?: number
  /** 千分位分隔 */
  groupSeparator?: boolean
}

const props = withDefaults(defineProps<StatisticProps>(), {
  prefix: '',
  suffix: '',
  precision: 0,
  groupSeparator: true,
})

const formatted = computed(() => {
  const fixed = props.value.toFixed(props.precision)
  if (!props.groupSeparator) return fixed
  const [int, dec] = fixed.split('.')
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${dec ? `.${dec}` : ''}`
})
</script>

<template>
  <div class="kb-statistic">
    <div class="kb-statistic__title">{{ title }}</div>
    <div class="kb-statistic__value">
      <span v-if="prefix" class="kb-statistic__prefix">{{ prefix }}</span>
      {{ formatted }}
      <span v-if="suffix" class="kb-statistic__suffix">{{ suffix }}</span>
    </div>
    <div v-if="$slots.default" class="kb-statistic__extra">
      <slot />
    </div>
  </div>
</template>
