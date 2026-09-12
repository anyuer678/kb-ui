<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'KbTree' })

export interface TreeNode {
  label: string
  value?: string
  children?: TreeNode[]
  disabled?: boolean
}

export type DropPosition = 'before' | 'after' | 'inner'

export interface TreeDropPayload {
  dragNode: TreeNode
  dropNode: TreeNode
  position: DropPosition
  data: TreeNode[]
}

export interface TreeProps {
  data?: TreeNode[]
  /** 设置后启用虚拟滚动，值为可视区高度（px） */
  height?: number | null
  /** 虚拟滚动下每一行的高度（px） */
  itemHeight?: number
  /** 是否可拖拽排序 */
  draggable?: boolean
  /** 拖拽落点校验，返回 false 则禁止落在此位置 */
  allowDrop?: (drag: TreeNode, drop: TreeNode, position: DropPosition) => boolean
  /** 默认展开全部含子节点的节点 */
  defaultExpandAll?: boolean
}

const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
  height: null,
  itemHeight: 32,
  draggable: false,
  defaultExpandAll: false,
})

const emit = defineEmits<{
  select: [node: TreeNode]
  drop: [payload: TreeDropPayload]
}>()

/** 内部维护一份数据副本：拖拽调整结构时不直接修改 prop，而是改动副本并随事件抛出 */
function cloneNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneNodes(node.children) : undefined,
  }))
}

const treeData = ref<TreeNode[]>(cloneNodes(props.data))

watch(
  () => props.data,
  (value) => {
    treeData.value = cloneNodes(value)
    expandedKeys.value = collectDefaultExpanded(treeData.value)
  },
)

/* ------------------------------ 节点标识 ------------------------------ */
// 用 WeakMap 给节点分配稳定 uid，保证重排/展开时 key 不漂移
const uidMap = new WeakMap<object, number>()
let uidSeed = 0

function uidOf(node: object): number {
  let uid = uidMap.get(node)
  if (uid === undefined) {
    uidSeed += 1
    uid = uidSeed
    uidMap.set(node, uid)
  }
  return uid
}

function collectDefaultExpanded(nodes: TreeNode[], acc = new Set<number>()): Set<number> {
  for (const node of nodes) {
    if (node.children?.length) {
      acc.add(uidOf(node))
      collectDefaultExpanded(node.children, acc)
    }
  }
  return acc
}

/* ------------------------------ 展开状态 ------------------------------ */
const expandedKeys = ref<Set<number>>(
  props.defaultExpandAll ? collectDefaultExpanded(treeData.value) : new Set(),
)

function isOpen(node: TreeNode): boolean {
  return expandedKeys.value.has(uidOf(node))
}

function toggle(node: TreeNode) {
  const next = new Set(expandedKeys.value)
  const key = uidOf(node)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}

/* ------------------------------ 选中状态 ------------------------------ */
const selectedKey = ref<number | null>(null)

function select(node: TreeNode) {
  if (node.disabled) return
  selectedKey.value = uidOf(node)
  emit('select', node)
}

/* ------------------------------ 扁平化 ------------------------------ */
interface FlatNode {
  node: TreeNode
  key: number
  depth: number
  parent: TreeNode | null
}

const flatNodes = computed<FlatNode[]>(() => {
  const out: FlatNode[] = []
  const walk = (nodes: TreeNode[], depth: number, parent: TreeNode | null) => {
    for (const node of nodes) {
      out.push({ node, key: uidOf(node), depth, parent })
      if (node.children?.length && isOpen(node)) walk(node.children, depth + 1, node)
    }
  }
  walk(treeData.value, 0, null)
  return out
})

/* ------------------------------ 虚拟滚动 ------------------------------ */
const BUFFER = 3
const scrollTop = ref(0)

const isVirtual = computed(() => typeof props.height === 'number' && props.height > 0)
const viewportHeight = computed(() => props.height ?? 0)

const startIndex = computed(() => {
  if (!isVirtual.value) return 0
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - BUFFER)
})

const endIndex = computed(() => {
  if (!isVirtual.value) return flatNodes.value.length
  const visible = Math.ceil(viewportHeight.value / props.itemHeight) + BUFFER * 2
  return Math.min(flatNodes.value.length, startIndex.value + visible)
})

const visibleNodes = computed(() => flatNodes.value.slice(startIndex.value, endIndex.value))
const totalHeight = computed(() => flatNodes.value.length * props.itemHeight)
const offsetY = computed(() => startIndex.value * props.itemHeight)

function onScroll(event: Event) {
  scrollTop.value = (event.target as HTMLElement).scrollTop
}

function rowStyle(index: number) {
  if (!isVirtual.value) return undefined
  return {
    position: 'absolute' as const,
    top: `${offsetY.value + index * props.itemHeight}px`,
    left: '0',
    right: '0',
    height: `${props.itemHeight}px`,
  }
}

/* ------------------------------ 拖拽 ------------------------------ */
const dragNode = ref<TreeNode | null>(null)
const dragOverKey = ref<number | null>(null)
const dropPosition = ref<DropPosition | null>(null)

function hasChildren(node: TreeNode): boolean {
  return !!node.children?.length
}

function containsNode(root: TreeNode, target: TreeNode): boolean {
  if (root === target) return true
  if (!root.children?.length) return false
  return root.children.some((child) => containsNode(child, target))
}

function resolvePosition(event: DragEvent, item: FlatNode): DropPosition {
  const el = event.currentTarget as HTMLElement | null
  const rect = el?.getBoundingClientRect()
  const height = rect?.height ?? 0
  const ratio = height > 0 ? (event.clientY - rect!.top) / height : 0.5
  if (ratio < 0.25) return 'before'
  if (ratio > 0.75) return 'after'
  return hasChildren(item.node) ? 'inner' : 'after'
}

function resetDrag() {
  dragNode.value = null
  dragOverKey.value = null
  dropPosition.value = null
}

function onDragStart(event: DragEvent, item: FlatNode) {
  if (!props.draggable || item.node.disabled) {
    event.preventDefault()
    return
  }
  dragNode.value = item.node
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(item.key))
  }
}

function onDragOver(event: DragEvent, item: FlatNode) {
  const dragging = dragNode.value
  if (!props.draggable || !dragging) return
  if (item.node === dragging) return
  // 不允许把节点拖进自己的子孙里
  if (containsNode(dragging, item.node)) return

  const position = resolvePosition(event, item)
  if (props.allowDrop && !props.allowDrop(dragging, item.node, position)) {
    dragOverKey.value = null
    dropPosition.value = null
    return
  }
  event.preventDefault()
  dragOverKey.value = item.key
  dropPosition.value = position
}

function onDragLeave(item: FlatNode) {
  if (dragOverKey.value === item.key) {
    dragOverKey.value = null
    dropPosition.value = null
  }
}

function removeNode(nodes: TreeNode[], target: TreeNode): boolean {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i] === target) {
      nodes.splice(i, 1)
      return true
    }
    const children = nodes[i].children
    if (children?.length && removeNode(children, target)) return true
  }
  return false
}

function insertNode(
  nodes: TreeNode[],
  drop: TreeNode,
  drag: TreeNode,
  position: DropPosition,
): boolean {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i] === drop) {
      if (position === 'before') nodes.splice(i, 0, drag)
      else if (position === 'after') nodes.splice(i + 1, 0, drag)
      else {
        drop.children = drop.children ?? []
        drop.children.push(drag)
        expandedKeys.value = new Set(expandedKeys.value).add(uidOf(drop))
      }
      return true
    }
    const children = nodes[i].children
    if (children?.length && insertNode(children, drop, drag, position)) return true
  }
  return false
}

function moveNode(drag: TreeNode, drop: TreeNode, position: DropPosition): TreeNode[] {
  removeNode(treeData.value, drag)
  insertNode(treeData.value, drop, drag, position)
  treeData.value = [...treeData.value]
  return treeData.value
}

function onDrop(event: DragEvent, item: FlatNode) {
  const dragging = dragNode.value
  const position = dropPosition.value
  if (dragging && position && dragOverKey.value === item.key) {
    event.preventDefault()
    const data = moveNode(dragging, item.node, position)
    emit('drop', { dragNode: dragging, dropNode: item.node, position, data })
  }
  resetDrag()
}
</script>

<template>
  <div class="kb-tree" :class="{ 'kb-tree--virtual': isVirtual }">
    <div
      class="kb-tree__scroll"
      :style="isVirtual ? { height: `${viewportHeight}px` } : undefined"
      @scroll="onScroll"
    >
      <div class="kb-tree__inner" :style="isVirtual ? { height: `${totalHeight}px` } : undefined">
        <div
          v-for="(item, index) in visibleNodes"
          :key="item.key"
          class="kb-tree__row"
          :class="{
            'kb-tree__row--selected': selectedKey === item.key,
            'kb-tree__row--disabled': item.node.disabled,
            'kb-tree__row--dragover': dragOverKey === item.key,
            [`kb-tree__row--drop-${dropPosition}`]: dragOverKey === item.key,
          }"
          :style="rowStyle(index)"
          :draggable="props.draggable"
          @click="select(item.node)"
          @dragstart="onDragStart($event, item)"
          @dragover="onDragOver($event, item)"
          @dragleave="onDragLeave(item)"
          @drop="onDrop($event, item)"
          @dragend="resetDrag"
        >
          <span class="kb-tree__indent" :style="{ width: `${item.depth * 18}px` }" />
          <span
            v-if="hasChildren(item.node)"
            class="kb-tree__toggle"
            :class="{ 'kb-tree__toggle--open': isOpen(item.node) }"
            role="button"
            :aria-expanded="isOpen(item.node)"
            @click.stop="toggle(item.node)"
          >
            ▸
          </span>
          <span v-else class="kb-tree__toggle kb-tree__toggle--leaf" />
          <span
            class="kb-tree__label"
            :class="{ 'kb-tree__label--selected': selectedKey === item.key }"
          >
            {{ item.node.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
