<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '../Icon'
import { useGlobalConfig, useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbAutoComplete' })

export interface AutoCompleteOption {
  value: string
  label?: string
  disabled?: boolean
}

export type AutoCompleteSource = string[] | AutoCompleteOption[]

export interface AutoCompleteProps {
  modelValue?: string
  /** 候选数据源，支持字符串数组或 { value, label } 数组 */
  options?: AutoCompleteSource
  /** 输入框占位文案，不传时取语言包中的 `common.placeholder` */
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  /** 是否按输入内容本地过滤，默认 true */
  filter?: boolean
  /** 远程取数：返回候选数组，返回空数组表示无结果 */
  fetchSuggestions?: (query: string) => AutoCompleteOption[] | Promise<AutoCompleteOption[]>
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  modelValue: '',
  options: () => [],
  placeholder: '',
  disabled: false,
  clearable: false,
  filter: true,
  fetchSuggestions: undefined,
  size: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [option: AutoCompleteOption]
  change: [value: string]
}>()

const { t } = useLocale()
const { size: globalSize } = useGlobalConfig()
/** 组件自身 size 优先，否则跟随 ConfigProvider */
const size = computed(() => props.size ?? globalSize)
/** 面板 id 需唯一，同页面可能有多个实例 */
const listId = `kb-autocomplete-${Math.random().toString(36).slice(2, 8)}`

const open = ref(false)
/** 高亮项下标，-1 表示无高亮 */
const activeIndex = ref(-1)
const rootEl = ref<HTMLDivElement | null>(null)
/** 远程模式下的候选缓存 */
const remoteOptions = ref<AutoCompleteOption[]>([])

/** 统一成 { value, label } 结构 */
const normalized = computed<AutoCompleteOption[]>(() =>
  (props.options as AutoCompleteSource).map((item) =>
    typeof item === 'string'
      ? { value: item, label: item }
      : { value: item.value, label: item.label ?? item.value, disabled: item.disabled },
  ),
)

/** 本地过滤：默认按 label 做不区分大小写的包含匹配 */
const filtered = computed<AutoCompleteOption[]>(() => {
  const query = props.modelValue.trim()
  if (!props.filter || !query) return normalized.value
  return normalized.value.filter((option) =>
    (option.label ?? option.value).toLowerCase().includes(query.toLowerCase()),
  )
})

/** 远程优先，否则用本地过滤结果 */
const suggestions = computed(() => (props.fetchSuggestions ? remoteOptions.value : filtered.value))

/** 候选项为空时展示的提示 */
const showEmpty = computed(() => open.value && suggestions.value.length === 0)

const inputPlaceholder = computed(() => props.placeholder || t('common.placeholder'))

function emitValue(value: string): void {
  emit('update:modelValue', value)
  emit('change', value)
}

/** 输入变化：本地过滤交给 computed，远程模式重新取数 */
async function handleInput(event: Event): Promise<void> {
  const value = (event.target as HTMLInputElement).value
  emitValue(value)
  open.value = true
  activeIndex.value = -1

  if (!props.fetchSuggestions) return
  const result = await props.fetchSuggestions(value)
  remoteOptions.value = result
}

function handleFocus(): void {
  if (props.disabled) return
  open.value = true
}

function select(option: AutoCompleteOption): void {
  if (option.disabled) return
  emitValue(option.value)
  emit('select', option)
  open.value = false
  activeIndex.value = -1
}

function clear(): void {
  emitValue('')
  remoteOptions.value = []
  activeIndex.value = -1
}

/** 在候选项间移动高亮，跳过禁用项 */
function move(delta: number): void {
  const list = suggestions.value
  if (!list.length) return
  // 从无高亮出发时：向下取首项、向上取末项，符合常见列表的键盘习惯
  let next = activeIndex.value < 0 ? (delta > 0 ? -1 : 0) : activeIndex.value
  for (let step = 0; step < list.length; step += 1) {
    next = (next + delta + list.length) % list.length
    if (!list[next].disabled) break
  }
  activeIndex.value = next
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    open.value = true
    move(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    open.value = true
    move(-1)
  } else if (event.key === 'Enter') {
    const target = suggestions.value[activeIndex.value]
    if (open.value && target) {
      event.preventDefault()
      select(target)
    }
  } else if (event.key === 'Escape') {
    open.value = false
  }
}

function handleOutside(event: MouseEvent): void {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) open.value = false
}

// 输入被外部重置为空时清掉远程候选，避免残留上一次结果
watch(
  () => props.modelValue,
  (value) => {
    if (!value) remoteOptions.value = []
  },
)

onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))

const showClear = computed(
  () => props.clearable && !!props.modelValue && !props.disabled,
)
</script>

<template>
  <div ref="rootEl" class="kb-autocomplete">
    <div class="kb-autocomplete__control" :class="`kb-autocomplete__control--${size}`">
      <input
        class="kb-autocomplete__input"
        type="text"
        role="combobox"
        :value="modelValue"
        :placeholder="inputPlaceholder"
        :disabled="disabled"
        :aria-expanded="open"
        aria-autocomplete="list"
        :aria-controls="listId"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      <span v-if="showClear" class="kb-autocomplete__clear" role="button" :aria-label="t('common.clear')" @click="clear">
        <Icon name="close" :size="14" />
      </span>
    </div>

    <div v-if="open" :id="listId" class="kb-autocomplete__panel" role="listbox">
      <div v-if="showEmpty" class="kb-autocomplete__empty">{{ t('common.noMatch') }}</div>
      <div
        v-for="(option, index) in suggestions"
        v-else
        :key="option.value"
        class="kb-autocomplete__option"
        :class="{
          'kb-autocomplete__option--active': index === activeIndex,
          'kb-autocomplete__option--disabled': option.disabled,
        }"
        role="option"
        :aria-selected="index === activeIndex"
        :aria-disabled="option.disabled"
        @click="select(option)"
        @mouseenter="activeIndex = index"
      >
        <slot name="option" :option="option">{{ option.label }}</slot>
      </div>
    </div>
  </div>
</template>
