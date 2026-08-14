<script setup lang="ts">
import { Icon } from '../Icon'

defineOptions({ name: 'KbSearch' })

export interface SearchProps {
  modelValue?: string
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<SearchProps>(), {
  modelValue: '',
  placeholder: '搜索…',
  size: 'medium',
})

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
      :placeholder="placeholder"
      @input="handleInput"
      @keyup.enter="doSearch"
    />
    <button class="kb-search__button" type="button" @click="doSearch">搜索</button>
  </div>
</template>
