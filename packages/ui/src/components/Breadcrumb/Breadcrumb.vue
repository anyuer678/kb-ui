<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbBreadcrumb' })

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** 分隔符 */
  separator?: string
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  items: () => [],
  separator: '/',
})

const displayItems = computed(() => props.items)
</script>

<template>
  <nav class="kb-breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in displayItems" :key="index">
      <span
        class="kb-breadcrumb__item"
        :class="{ 'kb-breadcrumb__item--current': index === displayItems.length - 1 }"
      >
        <a v-if="item.href && index < displayItems.length - 1" :href="item.href">
          {{ item.label }}
        </a>
        <span v-else>{{ item.label }}</span>
      </span>
      <span v-if="index < displayItems.length - 1" class="kb-breadcrumb__separator">
        {{ separator }}
      </span>
    </template>
  </nav>
</template>
