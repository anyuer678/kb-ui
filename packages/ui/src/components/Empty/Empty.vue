<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbEmpty' })

export interface EmptyProps {
  /** 空状态文案，不传时取语言包中的 `empty.description` */
  description?: string
}

const props = withDefaults(defineProps<EmptyProps>(), {
  description: '',
})

const { t } = useLocale()
/** 显式传入优先，未传时回落到当前语言包 */
const text = computed(() => props.description || t('empty.description'))
</script>

<template>
  <div class="kb-empty">
    <div class="kb-empty__image">
      <slot name="image">
        <Icon name="menu" :size="48" />
      </slot>
    </div>
    <p class="kb-empty__description">{{ text }}</p>
    <div v-if="$slots.action" class="kb-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>
