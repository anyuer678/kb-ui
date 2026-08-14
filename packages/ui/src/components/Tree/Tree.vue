<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'KbTree' })

export interface TreeNode {
  label: string
  value?: string
  children?: TreeNode[]
}

export interface TreeProps {
  data: TreeNode[]
}

const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
})

const emit = defineEmits<{ select: [node: TreeNode] }>()

const expanded = ref<Set<TreeNode>>(new Set())
const selected = ref<TreeNode | null>(null)

function isOpen(node: TreeNode): boolean {
  return expanded.value.has(node)
}

function toggle(node: TreeNode) {
  const next = new Set(expanded.value)
  if (next.has(node)) next.delete(node)
  else next.add(node)
  expanded.value = next
}

function select(node: TreeNode) {
  selected.value = node
  emit('select', node)
}
</script>

<template>
  <div class="kb-tree">
    <template v-for="(node, index) in props.data" :key="`${node.label}-${index}`">
      <div class="kb-tree__row">
        <span
          v-if="node.children && node.children.length"
          class="kb-tree__toggle"
          :class="{ 'kb-tree__toggle--open': isOpen(node) }"
          role="button"
          @click="toggle(node)"
        >
          ▸
        </span>
        <span v-else class="kb-tree__toggle kb-tree__toggle--leaf" />
        <span
          class="kb-tree__label"
          :class="{ 'kb-tree__label--selected': selected === node }"
          @click="select(node)"
        >
          {{ node.label }}
        </span>
      </div>
      <div v-if="node.children && node.children.length && isOpen(node)" class="kb-tree__children">
        <KbTree :data="node.children" @select="select" />
      </div>
    </template>
  </div>
</template>
