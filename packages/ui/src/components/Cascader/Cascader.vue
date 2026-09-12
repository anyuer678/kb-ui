<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'KbCascader' })

export interface CascaderOption {
  label: string
  value: string | number
  children?: CascaderOption[]
  /** 显式标记为叶子节点：异步模式下点击即收起，不再请求下一级 */
  leaf?: boolean
  disabled?: boolean
}

export type CascaderValue = (string | number)[]

export interface CascaderProps {
  options?: CascaderOption[]
  modelValue?: CascaderValue
  placeholder?: string
  /** 已选路径的展示分隔符 */
  separator?: string
  disabled?: boolean
  clearable?: boolean
  /** 开启异步加载，需配合 lazyLoad 使用 */
  lazy?: boolean
  /** 异步加载子节点，node 为 null 表示加载根级 */
  lazyLoad?: (node: CascaderOption | null, resolve: (children: CascaderOption[]) => void) => void
}

const props = withDefaults(defineProps<CascaderProps>(), {
  options: () => [],
  modelValue: () => [],
  placeholder: '请选择',
  separator: ' / ',
  disabled: false,
  clearable: false,
  lazy: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: CascaderValue] }>()

const open = ref(false)
const levels = ref<CascaderOption[][]>([])
/** 异步模式下加载出的根级选项 */
const lazyRoots = ref<CascaderOption[] | null>(null)
/** 正在加载的目标列索引，null 表示当前没有加载中的列 */
const loadingIndex = ref<number | null>(null)
/** value -> label，异步模式下用于在子级尚未加载时还原展示文案 */
const knownLabels = ref<Record<string, string>>({})
const panelId = `kb-cascader-${Math.random().toString(36).slice(2, 8)}`

const isLazy = computed(() => props.lazy && typeof props.lazyLoad === 'function')

const rootList = computed<CascaderOption[]>(() =>
  isLazy.value ? (lazyRoots.value ?? []) : props.options,
)

const showClear = computed(
  () => props.clearable && props.modelValue.length > 0 && !props.disabled,
)

const displayText = computed(() => {
  if (!props.modelValue.length) return props.placeholder
  const parts: string[] = []
  let list: CascaderOption[] = rootList.value
  for (const value of props.modelValue) {
    const found = list.find((option) => option.value === value)
    if (!found) {
      const label = knownLabels.value[String(value)]
      if (!label) break
      parts.push(label)
      list = []
      continue
    }
    parts.push(found.label)
    list = found.children ?? []
  }
  return parts.length ? parts.join(props.separator) : props.placeholder
})

function cacheLabels(list: CascaderOption[]) {
  const map = { ...knownLabels.value }
  for (const option of list) map[String(option.value)] = option.label
  knownLabels.value = map
}

/** 按已选路径还原每一级的面板数据 */
function buildLevels(): CascaderOption[][] {
  const result: CascaderOption[][] = [rootList.value]
  cacheLabels(rootList.value)
  let list = rootList.value
  for (const value of props.modelValue) {
    const found = list.find((option) => option.value === value)
    if (!found?.children?.length) break
    list = found.children
    result.push(list)
    cacheLabels(list)
  }
  return result
}

function closeMenu() {
  open.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
  }
}

function loadChildren(node: CascaderOption | null, level: number) {
  if (!isLazy.value || !props.lazyLoad) return
  loadingIndex.value = level
  props.lazyLoad(node, (children) => {
    if (node) node.children = children
    else lazyRoots.value = children
    cacheLabels(children)
    loadingIndex.value = null

    // 加载到空数组说明是叶子节点，直接收起
    if (node && !children.length) {
      closeMenu()
      return
    }
    const next = levels.value.slice(0, level)
    next[level] = children
    levels.value = next
  })
}

function toggleOpen() {
  if (props.disabled) return
  if (open.value) {
    closeMenu()
    return
  }
  open.value = true
  // 异步模式下首次展开先拉根级
  if (isLazy.value && lazyRoots.value === null) {
    levels.value = []
    loadChildren(null, 0)
    return
  }
  levels.value = buildLevels()
}

function select(option: CascaderOption, level: number) {
  if (option.disabled) return
  const next = [...props.modelValue.slice(0, level), option.value]
  emit('update:modelValue', next)

  if (option.leaf) {
    closeMenu()
    return
  }
  if (option.children?.length) {
    levels.value = [...levels.value.slice(0, level + 1), option.children]
    cacheLabels(option.children)
    return
  }
  // 异步模式下 children 尚未加载，触发加载并展开下一列
  if (isLazy.value && option.children === undefined) {
    levels.value = levels.value.slice(0, level + 1)
    loadChildren(option, level + 1)
    return
  }
  closeMenu()
}

function clear(event: MouseEvent) {
  event.stopPropagation()
  if (props.disabled) return
  emit('update:modelValue', [])
  knownLabels.value = {}
  levels.value = rootList.value.length ? [rootList.value] : []
}
</script>

<template>
  <div class="kb-cascader" :class="{ 'kb-cascader--disabled': disabled }">
    <div
      class="kb-cascader__trigger"
      tabindex="0"
      role="combobox"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-disabled="disabled"
      @click="toggleOpen"
      @keydown="handleKeydown"
    >
      <span :class="{ 'kb-cascader__placeholder': displayText === placeholder }">
        {{ displayText }}
      </span>
      <span class="kb-cascader__suffix">
        <span
          v-if="showClear"
          class="kb-cascader__clear"
          role="button"
          aria-label="清空"
          @click="clear"
          >×</span
        >
        <span class="kb-cascader__arrow">▾</span>
      </span>
    </div>
    <div v-if="open" :id="panelId" class="kb-cascader__panel" role="dialog" aria-label="级联选择">
      <div
        v-for="(list, level) in levels"
        :key="level"
        class="kb-cascader__column"
        role="listbox"
        :aria-label="`第 ${level + 1} 级`"
      >
        <div
          v-for="option in list"
          :key="option.value"
          class="kb-cascader__option"
          :class="{
            'kb-cascader__option--active': modelValue[level] === option.value,
            'kb-cascader__option--disabled': option.disabled,
          }"
          role="option"
          :aria-selected="modelValue[level] === option.value"
          :aria-disabled="option.disabled"
          @click="select(option, level)"
        >
          <span>{{ option.label }}</span>
          <span v-if="option.leaf" class="kb-cascader__leaf-tag">可选</span>
          <span v-else-if="option.children?.length" class="kb-cascader__more">›</span>
        </div>
      </div>
      <div
        v-if="loadingIndex !== null && loadingIndex >= levels.length"
        class="kb-cascader__column"
        aria-busy="true"
      >
        <div class="kb-cascader__loading">加载中…</div>
      </div>
    </div>
  </div>
</template>
