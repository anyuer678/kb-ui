<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbTabs' })

export interface TabItem {
  label: string
  name: string
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  /** 当前激活 tab 名 */
  modelValue?: string
}

const props = withDefaults(defineProps<TabsProps>(), {
  tabs: () => [],
  modelValue: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const activeName = computed(() => props.modelValue)

function select(tab: TabItem) {
  if (tab.disabled) return
  emit('update:modelValue', tab.name)
}
</script>

<template>
  <div class="kb-tabs">
    <div class="kb-tabs__nav">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        class="kb-tabs__tab"
        :class="{
          'kb-tabs__tab--active': tab.name === activeName,
          'kb-tabs__tab--disabled': tab.disabled,
        }"
        role="tab"
        :aria-selected="tab.name === activeName"
        @click="select(tab)"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="kb-tabs__panel">
      <slot />
    </div>
  </div>
</template>
