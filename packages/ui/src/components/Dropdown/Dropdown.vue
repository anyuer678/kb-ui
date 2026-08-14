<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'KbDropdown' })

export interface DropdownItem {
  label: string
  key: string
  disabled?: boolean
  danger?: boolean
}

export interface DropdownProps {
  items: DropdownItem[]
  /** 触发方式 */
  trigger?: 'hover' | 'click'
}

const props = withDefaults(defineProps<DropdownProps>(), {
  items: () => [],
  trigger: 'hover',
})

const emit = defineEmits<{ select: [key: string] }>()

const open = ref(false)
const rootEl = ref<HTMLDivElement | null>(null)

function toggle() {
  if (props.trigger === 'click') open.value = !open.value
}

function select(item: DropdownItem) {
  if (item.disabled) return
  emit('select', item.key)
  open.value = false
}

function handleOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))
</script>

<template>
  <div
    ref="rootEl"
    class="kb-dropdown"
    @mouseenter="trigger === 'hover' && (open = true)"
    @mouseleave="trigger === 'hover' && (open = false)"
    @click="toggle"
  >
    <slot />
    <div v-if="open" class="kb-dropdown__menu">
      <div
        v-for="item in items"
        :key="item.key"
        class="kb-dropdown__item"
        :class="{
          'kb-dropdown__item--disabled': item.disabled,
          'kb-dropdown__item--danger': item.danger,
        }"
        @click="select(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
