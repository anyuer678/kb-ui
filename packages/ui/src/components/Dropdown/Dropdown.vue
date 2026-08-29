<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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
const activeIndex = ref(-1)

const menuId = `kb-dropdown-${Math.random().toString(36).slice(2, 8)}`
const activeItemKey = computed(() =>
  open.value && activeIndex.value >= 0 ? `${menuId}-item-${activeIndex.value}` : undefined,
)

function openMenu() {
  open.value = true
  activeIndex.value = props.items.findIndex((it) => !it.disabled)
}

function closeMenu() {
  open.value = false
  activeIndex.value = -1
}

function toggle() {
  if (props.trigger === 'click') {
    open.value ? closeMenu() : openMenu()
  } else {
    open.value ? closeMenu() : openMenu()
  }
}

function select(item: DropdownItem) {
  if (item.disabled) return
  emit('select', item.key)
  closeMenu()
}

function moveActive(delta: 1 | -1) {
  const enabled = props.items.reduce<number[]>((acc, it, i) => (it.disabled ? acc : (acc.push(i), acc)), [])
  if (!enabled.length) return
  let idx = activeIndex.value
  do {
    idx += delta
  } while (idx >= 0 && idx < props.items.length && props.items[idx].disabled)
  if (idx >= 0 && idx < props.items.length) activeIndex.value = idx
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open.value && activeIndex.value >= 0) select(props.items[activeIndex.value])
      else openMenu()
      break
    case 'ArrowDown':
      event.preventDefault()
      open.value ? moveActive(1) : openMenu()
      break
    case 'ArrowUp':
      event.preventDefault()
      open.value ? moveActive(-1) : openMenu()
      break
    case 'Escape':
      event.preventDefault()
      closeMenu()
      break
  }
}

function handleOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) closeMenu()
}

onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))
</script>

<template>
  <div
    ref="rootEl"
    class="kb-dropdown"
    @mouseenter="trigger === 'hover' && openMenu()"
    @mouseleave="trigger === 'hover' && closeMenu()"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <slot />
    <div
      v-if="open"
      :id="menuId"
      class="kb-dropdown__menu"
      role="menu"
      :aria-activedescendant="activeItemKey"
    >
      <div
        v-for="(item, i) in items"
        :id="`${menuId}-item-${i}`"
        :key="item.key"
        class="kb-dropdown__item"
        :class="{
          'kb-dropdown__item--active': i === activeIndex,
          'kb-dropdown__item--disabled': item.disabled,
          'kb-dropdown__item--danger': item.danger,
        }"
        role="menuitem"
        :aria-disabled="item.disabled || undefined"
        @click="select(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
