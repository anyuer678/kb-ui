<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbList' })

export interface ListProps<T = unknown> {
  items: T[]
  /** 无数据时的文案，不传时取语言包中的 `list.empty` */
  empty?: string
  bordered?: boolean
}

const props = withDefaults(defineProps<ListProps>(), {
  items: () => [],
  empty: '',
  bordered: false,
})

const { t } = useLocale()
const classes = computed(() => ['kb-list', { 'kb-list--bordered': props.bordered }])
const emptyText = computed(() => props.empty || t('list.empty'))
</script>

<template>
  <div :class="classes" role="list">
    <div v-if="items.length">
      <div v-for="(item, index) in items" :key="index" class="kb-list__item" role="listitem">
        <slot name="item" :item="item" :index="index">{{ item }}</slot>
      </div>
    </div>
    <div v-else class="kb-list__empty">{{ emptyText }}</div>
  </div>
</template>
