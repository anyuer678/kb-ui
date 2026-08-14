<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbList' })

export interface ListProps<T = unknown> {
  items: T[]
  empty?: string
  bordered?: boolean
}

const props = withDefaults(defineProps<ListProps>(), {
  items: () => [],
  empty: '暂无数据',
  bordered: false,
})

const classes = computed(() => ['kb-list', { 'kb-list--bordered': props.bordered }])
</script>

<template>
  <div :class="classes">
    <div v-if="items.length">
      <div v-for="(item, index) in items" :key="index" class="kb-list__item">
        <slot name="item" :item="item" :index="index">{{ item }}</slot>
      </div>
    </div>
    <div v-else class="kb-list__empty">{{ empty }}</div>
  </div>
</template>
