<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'KbCollapse' })

export interface CollapseItem {
  title: string
  content?: string
  disabled?: boolean
}

export interface CollapseProps {
  items: CollapseItem[]
  /** 当前展开项（数组，多开） */
  modelValue?: string[]
  /** 手风琴模式（单选） */
  accordion?: boolean
}

const props = withDefaults(defineProps<CollapseProps>(), {
  items: () => [],
  modelValue: () => [],
  accordion: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

// 内部展开状态（非受控；外部 v-model 变化时同步）
const localOpen = ref<string[]>([])

watch(
  () => props.modelValue,
  (v) => {
    if (JSON.stringify(v) !== JSON.stringify(localOpen.value)) {
      localOpen.value = [...v]
    }
  },
  { immediate: true },
)

const openKeys = computed(() => localOpen.value)

function isOpen(index: number): boolean {
  return openKeys.value.includes(String(index))
}

function toggle(index: number, item: CollapseItem) {
  if (item.disabled) return
  const key = String(index)
  let next: string[]
  if (props.accordion) {
    next = isOpen(index) ? [] : [key]
  } else {
    next = isOpen(index)
      ? openKeys.value.filter((k) => k !== key)
      : [...openKeys.value, key]
  }
  emit('update:modelValue', next)
  localOpen.value = next
}
</script>

<template>
  <div class="kb-collapse">
    <div v-for="(item, index) in items" :key="index" class="kb-collapse__panel">
      <div
        class="kb-collapse__header"
        :class="{ 'kb-collapse__header--disabled': item.disabled }"
        role="button"
        tabindex="0"
        @click="toggle(index, item)"
        @keydown.enter="toggle(index, item)"
      >
        <span class="kb-collapse__title">{{ item.title }}</span>
        <span class="kb-collapse__arrow" :class="{ 'kb-collapse__arrow--open': isOpen(index) }">▾</span>
      </div>
      <div v-if="isOpen(index)" class="kb-collapse__content">
        <slot :name="`item-${index}`" :item="item">{{ item.content }}</slot>
      </div>
    </div>
  </div>
</template>
