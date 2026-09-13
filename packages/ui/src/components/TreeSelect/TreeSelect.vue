<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbTreeSelect' })

export interface TreeSelectNode {
  label: string
  value: string | number
  children?: TreeSelectNode[]
  disabled?: boolean
}

export interface TreeSelectProps {
  options?: TreeSelectNode[]
  modelValue?: string | number | undefined
  /** 占位文案，不传时取语言包中的 `common.placeholder` */
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  /** 初始是否展开全部可展开节点 */
  defaultExpandAll?: boolean
}

const props = withDefaults(defineProps<TreeSelectProps>(), {
  options: () => [],
  modelValue: undefined,
  placeholder: '',
  disabled: false,
  clearable: false,
  defaultExpandAll: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
  change: [value: string | number | undefined]
}>()

const { t } = useLocale()

/** 下拉树的稳定 id，供选择框的 aria-controls 引用（ARIA 1.2 要求 combobox 必须带该属性） */
const listId = `kb-treeselect-${Math.random().toString(36).slice(2, 8)}`

const open = ref(false)
const rootEl = ref<HTMLDivElement | null>(null)
/** 展开的节点 value 集合 */
const expandedKeys = ref<Set<string | number>>(new Set())

/** 扁平化后的可见节点，避免递归组件 */
interface FlatNode {
  node: TreeSelectNode
  level: number
  expandable: boolean
  expanded: boolean
}

const flatNodes = computed<FlatNode[]>(() => {
  const out: FlatNode[] = []
  const walk = (nodes: TreeSelectNode[], level: number): void => {
    for (const node of nodes) {
      const expandable = !!node.children?.length
      const expanded = expandedKeys.value.has(node.value)
      out.push({ node, level, expandable, expanded })
      if (expandable && expanded) walk(node.children as TreeSelectNode[], level + 1)
    }
  }
  walk(props.options, 0)
  return out
})

/** 在树中按 value 查找节点，用于回显 label */
function findNode(nodes: TreeSelectNode[], value: string | number): TreeSelectNode | null {
  for (const node of nodes) {
    if (node.value === value) return node
    if (node.children) {
      const hit = findNode(node.children, value)
      if (hit) return hit
    }
  }
  return null
}

const selectedLabel = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) return ''
  return findNode(props.options, props.modelValue)?.label ?? ''
})

const displayText = computed(() => selectedLabel.value || props.placeholder || t('common.placeholder'))
const showClear = computed(
  () => props.clearable && selectedLabel.value !== '' && !props.disabled,
)

/** 收集所有可展开节点的 value */
function collectExpandable(nodes: TreeSelectNode[], acc: Set<string | number>): void {
  for (const node of nodes) {
    if (node.children?.length) {
      acc.add(node.value)
      collectExpandable(node.children, acc)
    }
  }
}

onMounted(() => {
  if (props.defaultExpandAll) {
    const acc = new Set<string | number>()
    collectExpandable(props.options, acc)
    expandedKeys.value = acc
  }
  document.addEventListener('click', handleOutside)
})

// 选项变化后补齐 defaultExpandAll 的展开状态
watch(
  () => props.options,
  () => {
    if (!props.defaultExpandAll) return
    const acc = new Set<string | number>()
    collectExpandable(props.options, acc)
    expandedKeys.value = acc
  },
)

onBeforeUnmount(() => document.removeEventListener('click', handleOutside))

function handleOutside(event: MouseEvent): void {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) open.value = false
}

function toggleExpand(node: TreeSelectNode): void {
  const next = new Set(expandedKeys.value)
  if (next.has(node.value)) next.delete(node.value)
  else next.add(node.value)
  expandedKeys.value = next
}

function select(node: TreeSelectNode): void {
  if (node.disabled) return
  emit('update:modelValue', node.value)
  emit('change', node.value)
  open.value = false
}

function clear(): void {
  emit('update:modelValue', undefined)
  emit('change', undefined)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') open.value = false
}
</script>

<template>
  <div ref="rootEl" class="kb-treeselect">
    <div
      class="kb-treeselect__control"
      :class="{ 'kb-treeselect__control--disabled': disabled }"
      role="combobox"
      tabindex="0"
      :aria-expanded="open"
      :aria-label="t('treeSelect.label')"
      :aria-controls="listId"
      @click="!disabled && (open = !open)"
      @keydown="handleKeydown"
    >
      <span class="kb-treeselect__text" :class="{ 'kb-treeselect__text--placeholder': !selectedLabel }">
        {{ displayText }}
      </span>
      <span v-if="showClear" class="kb-treeselect__clear" role="button" :aria-label="t('common.clear')" @click.stop="clear">
        <Icon name="close" :size="14" />
      </span>
      <span class="kb-treeselect__arrow">▾</span>
    </div>

    <div v-if="open" :id="listId" class="kb-treeselect__panel" role="tree" :aria-label="t('treeSelect.label')">
      <div v-if="!flatNodes.length" class="kb-treeselect__empty">{{ t('common.noMatch') }}</div>
      <div
        v-for="item in flatNodes"
        :key="item.node.value"
        class="kb-treeselect__node"
        :class="{
          'kb-treeselect__node--selected': item.node.value === modelValue,
          'kb-treeselect__node--disabled': item.node.disabled,
        }"
        role="treeitem"
        :aria-selected="item.node.value === modelValue"
        :aria-disabled="item.node.disabled"
        :aria-expanded="item.expandable ? item.expanded : undefined"
        :style="{ paddingLeft: `${12 + item.level * 18}px` }"
        @click="select(item.node)"
      >
        <span
          v-if="item.expandable"
          class="kb-treeselect__toggle"
          :class="{ 'kb-treeselect__toggle--expanded': item.expanded }"
          @click.stop="toggleExpand(item.node)"
        >
          <Icon name="chevron-right" :size="12" />
        </span>
        <span v-else class="kb-treeselect__toggle kb-treeselect__toggle--leaf" />
        <span class="kb-treeselect__label">{{ item.node.label }}</span>
      </div>
    </div>
  </div>
</template>
