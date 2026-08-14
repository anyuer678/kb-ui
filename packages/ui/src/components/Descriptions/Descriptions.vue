<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbDescriptions' })

export interface DescriptionItem {
  label: string
  value: string | number
}

export interface DescriptionsProps {
  items: DescriptionItem[]
  title?: string
  /** 每行列数 */
  column?: number
  border?: boolean
}

const props = withDefaults(defineProps<DescriptionsProps>(), {
  items: () => [],
  title: '',
  column: 3,
  border: false,
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.column}, 1fr)`,
}))

const classes = computed(() => [
  'kb-descriptions',
  { 'kb-descriptions--border': props.border },
])
</script>

<template>
  <div :class="classes">
    <div v-if="title" class="kb-descriptions__title">{{ title }}</div>
    <div class="kb-descriptions__grid" :style="gridStyle">
      <div v-for="(item, index) in items" :key="index" class="kb-descriptions__item">
        <div class="kb-descriptions__label">{{ item.label }}</div>
        <div class="kb-descriptions__value">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
