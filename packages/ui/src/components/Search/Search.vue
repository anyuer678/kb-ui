<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbSearch' })

export interface SearchProps {
  modelValue?: string
  /** 占位文案，不传时取语言包中的 `search.placeholder` */
  placeholder?: string
  /** 搜索按钮文案，不传时取语言包中的 `search.action` */
  buttonText?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<SearchProps>(), {
  modelValue: '',
  placeholder: '',
  buttonText: '',
  size: 'medium',
})

const { t } = useLocale()
const inputPlaceholder = computed(() => props.placeholder || t('search.placeholder'))
const actionText = computed(() => props.buttonText || t('search.action'))

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function doSearch() {
  emit('search', props.modelValue)
}
</script>

<template>
  <div class="kb-search">
    <Icon name="search" :size="16" class="kb-search__icon" />
    <input
      class="kb-search__input"
      :value="modelValue"
      :placeholder="inputPlaceholder"
      @input="handleInput"
      @keyup.enter="doSearch"
    />
    <button class="kb-search__button" type="button" @click="doSearch">{{ actionText }}</button>
  </div>
</template>
