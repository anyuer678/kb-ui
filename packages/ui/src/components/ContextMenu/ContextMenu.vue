<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbContextMenu' })

const { t } = useLocale()

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
  // 渲染后按视口边界修正位置，并把焦点移入菜单，键盘用户才能继续操作
  nextTick(() => {
    adjustPosition()
    focusItem(0)
  })
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

/** 可聚焦的菜单项（跳过 disabled） */
function focusableItems(): HTMLElement[] {
  const el = menuEl.value
  if (!el) return []
  return Array.from(el.querySelectorAll<HTMLElement>('.kb-contextmenu__item')).filter(
    (item) => item.getAttribute('aria-disabled') !== 'true',
  )
}

/** 把焦点移到第 index 个可选项（越界时夹取到边界，不循环） */
function focusItem(index: number): void {
  const items = focusableItems()
  if (!items.length) return
  const target = items[Math.min(Math.max(index, 0), items.length - 1)]
  target?.focus()
}

/** 当前获得焦点的菜单项序号，没有则返回 -1 */
function currentItemIndex(): number {
  const el = menuEl.value
  if (!el || typeof document === 'undefined') return -1
  const all = Array.from(el.querySelectorAll<HTMLElement>('.kb-contextmenu__item'))
  return all.indexOf(document.activeElement as HTMLElement)
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

/**
 * 菜单打开期间接管键盘，补齐 WAI-ARIA menu 模式：
 * Esc 关闭、上下方向键在菜单项间移动焦点、Home / End 跳到首尾
 */
function handleKeydown(event: KeyboardEvent): void {
  if (!visible.value) return
  if (event.key === 'Escape') {
    close()
    return
  }

  const items = focusableItems()
  if (!items.length) return
  const current = currentItemIndex()

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      focusItem(current < 0 ? 0 : current + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusItem(current < 0 ? items.length - 1 : current - 1)
      break
    case 'Home':
      event.preventDefault()
      focusItem(0)
      break
    case 'End':
      event.preventDefault()
      focusItem(items.length - 1)
      break
    default:
      break
  }
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
        :aria-label="t('contextMenu.label')"
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
          tabindex="-1"
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
