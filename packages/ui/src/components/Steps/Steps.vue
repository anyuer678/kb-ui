<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbSteps' })

export interface StepItem {
  title: string
  description?: string
}

export interface StepsProps {
  steps: StepItem[]
  /** 当前步骤索引（0 开始） */
  active?: number
}

const props = withDefaults(defineProps<StepsProps>(), {
  steps: () => [],
  active: 0,
})

const stateOf = computed(() => (index: number) => {
  if (index < props.active) return 'done'
  if (index === props.active) return 'active'
  return 'wait'
})
</script>

<template>
  <div class="kb-steps">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="kb-steps__item"
      :class="`kb-steps__item--${stateOf(index)}`"
    >
      <div class="kb-steps__head">
        <span class="kb-steps__circle">
          <Icon v-if="stateOf(index) === 'done'" name="check" :size="12" />
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span v-if="index < steps.length - 1" class="kb-steps__line" />
      </div>
      <div class="kb-steps__body">
        <div class="kb-steps__title">{{ step.title }}</div>
        <div v-if="step.description" class="kb-steps__description">{{ step.description }}</div>
      </div>
    </div>
  </div>
</template>
