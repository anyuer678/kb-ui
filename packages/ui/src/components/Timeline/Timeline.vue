<script setup lang="ts">
defineOptions({ name: 'KbTimeline' })

export interface TimelineItem {
  content: string
  time?: string
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export interface TimelineProps {
  items: TimelineItem[]
}

withDefaults(defineProps<TimelineProps>(), {
  items: () => [],
})
</script>

<template>
  <div class="kb-timeline" role="list">
    <div v-for="(item, index) in items" :key="index" class="kb-timeline__item" role="listitem">
      <div class="kb-timeline__node">
        <span class="kb-timeline__dot" :class="`kb-timeline__dot--${item.type ?? 'default'}`" />
        <span v-if="index < items.length - 1" class="kb-timeline__tail" />
      </div>
      <div class="kb-timeline__main">
        <div class="kb-timeline__content">{{ item.content }}</div>
        <div v-if="item.time" class="kb-timeline__time">{{ item.time }}</div>
      </div>
    </div>
  </div>
</template>
