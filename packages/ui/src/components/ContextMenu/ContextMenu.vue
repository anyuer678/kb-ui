<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbContextMenu' })

export interface ContextMenuItem {
  /** 唯一标识，透传给 select 事件 */
  key: string
  label: string
  /** 图标名，取自 Icon 组件内置图标 */
  icon?: string
  disabled?: boolean
  /** 是否在本项上方显示分隔线 */
  divided?: boolean
}

export interface ContextMenuProps {
  items?: ContextMenuItem[]
  /** 是否禁用右键菜单 */
  disabled?: boolean
}

const props = withDefaults(defineProps<ContextMenuProps>(), {
  items: () => [],
  disabled: false,
})

const emit = defineEmits<{
  select: [key: string]
  open: []
  close: []
}>()

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const menuEl = ref<HTMLDivElement | null>(null)

const menuStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}))

function openMenu(event: MouseEvent): void {
  if (props.disabled) return
  event.preventDefault()
  position.value = { x: event.clientX, y: event.clientY }
  visible.value = true
  emit('open')
  // 渲染后按视口边界修正位置，避免菜单溢出屏幕
  nextTick(adjustPosition)
}

/** 菜单超出右/下边界时向左/上翻转 */
function adjustPosition(): void {
  const el = menuEl.value
  if (!el || typeof window === 'undefined') return

  const rect = el.getBoundingClientRect()
  let { x, y } = position.value
  if (x + rect.width > window.innerWidth) x = Math.max(0, window.innerWidth - rect.width - 4)
  if (y + rect.height > window.innerHeight) y = Math.max(0, window.innerHeight - rect.height - 4)
  position.value = { x, y }
}

function close(): void {
  if (!visible.value) return
  visible.value = false
  emit('close')
}

function handleSelect(item: ContextMenuItem): void {
  if (item.disabled) return
  emit('select', item.key)
  close()
}

function handleDocumentClick(event: MouseEvent): void {
  if (menuEl.value && !menuEl.value.contains(event.target as Node)) close()
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({ close })
</script>

<template>
  <div class="kb-contextmenu" @contextmenu="openMenu">
    <slot />
    <Teleport to="body" :disabled="!visible">
      <div
        v-if="visible"
        ref="menuEl"
        class="kb-contextmenu__panel"
        :style="menuStyle"
        role="menu"
        @contextmenu.prevent
      >
        <div
          v-for="item in items"
          :key="item.key"
          class="kb-contextmenu__item"
          :class="{
            'kb-contextmenu__item--disabled': item.disabled,
            'kb-contextmenu__item--divided': item.divided,
          }"
          role="menuitem"
          :aria-disabled="item.disabled"
          @click="handleSelect(item)"
        >
          <Icon v-if="item.icon" :name="item.icon" :size="14" class="kb-contextmenu__icon" />
          <span class="kb-contextmenu__label">{{ item.label }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
