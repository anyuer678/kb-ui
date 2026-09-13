<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { Icon } from '../Icon'
import { LAYOUT_CONTEXT_KEY } from './constants'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbSider' })

export interface SiderProps {
  /** 展开时的宽度 */
  width?: number | string
  /** 收起时的宽度 */
  collapsedWidth?: number | string
  /** 是否收起（可用 v-model 双向绑定） */
  collapsed?: boolean
  /** 是否显示折叠触发器 */
  collapsible?: boolean
  /** 翻转触发器箭头方向（用于右侧侧边栏） */
  reverseArrow?: boolean
}

const props = withDefaults(defineProps<SiderProps>(), {
  width: 200,
  collapsedWidth: 64,
  collapsed: false,
  collapsible: false,
  reverseArrow: false,
})

const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
  /** 折叠状态变化时触发（在 update:collapsed 之后） */
  collapse: [collapsed: boolean, type: 'clickTrigger' | 'responsive']
}>()

const { t } = useLocale()

// Sider 可以脱离 Layout 单独使用，因此注入失败时退化为无操作
const layoutContext = inject(LAYOUT_CONTEXT_KEY, null)
let unregister: (() => void) | null = null

onMounted(() => {
  unregister = layoutContext?.registerSider() ?? null
})

onBeforeUnmount(() => {
  unregister?.()
  unregister = null
})

function toggleCollapsed(): void {
  const next = !props.collapsed
  emit('update:collapsed', next)
  emit('collapse', next, 'clickTrigger')
}

function toPx(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

const siderStyle = computed(() => ({
  width: toPx(props.collapsed ? props.collapsedWidth : props.width),
  flex: `0 0 ${toPx(props.collapsed ? props.collapsedWidth : props.width)}`,
}))

/** 箭头指向：收起时指向展开方向，展开时指向收起方向 */
const arrowName = computed(() => {
  const expand = props.collapsed ? 'right' : 'left'
  const flipped = props.reverseArrow ? (expand === 'left' ? 'right' : 'left') : expand
  return `arrow-${flipped}`
})

const triggerLabel = computed(() =>
  props.collapsed ? t('layout.expand') : t('layout.collapse'),
)
</script>

<template>
  <aside class="kb-layout__sider" :class="{ 'kb-layout__sider--collapsed': collapsed }" :style="siderStyle">
    <div class="kb-layout__sider-children">
      <slot />
    </div>
    <div
      v-if="collapsible"
      class="kb-layout__sider-trigger"
      role="button"
      tabindex="0"
      :aria-label="triggerLabel"
      :aria-expanded="!collapsed"
      @click="toggleCollapsed"
      @keydown.enter.prevent="toggleCollapsed"
      @keydown.space.prevent="toggleCollapsed"
    >
      <Icon :name="arrowName" :size="14" />
    </div>
  </aside>
</template>
