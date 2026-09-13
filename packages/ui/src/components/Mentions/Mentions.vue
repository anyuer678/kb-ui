<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { MentionFilter, MentionOption } from './types'

defineOptions({ name: 'KbMentions' })

export interface MentionsProps {
  modelValue?: string
  /** 候选项 */
  options?: MentionOption[]
  /** 触发前缀，可传多个 */
  prefix?: string | string[]
  rows?: number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  /** 自定义过滤；传 false 关闭过滤 */
  filterOption?: MentionFilter | false
  /** 无匹配时的文案 */
  notFoundContent?: string
}

const props = withDefaults(defineProps<MentionsProps>(), {
  modelValue: '',
  options: () => [],
  prefix: '@',
  rows: 2,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  filterOption: undefined,
  notFoundContent: '无匹配结果',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** 选中候选项 */
  select: [option: MentionOption, prefix: string]
  /** 搜索词变化 */
  search: [text: string, prefix: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const open = ref(false)
const searchText = ref('')
/** 当前触发前缀在文本中的起始下标 */
const prefixIndex = ref(-1)
/** 当前触发前缀（可能多字符） */
const activePrefix = ref('')
const activeIndex = ref(0)
const caret = ref({ top: 0, left: 0 })

const prefixes = computed(() => (Array.isArray(props.prefix) ? props.prefix : [props.prefix]))

const matchedOptions = computed(() => {
  if (!props.options.length) return []
  if (!searchText.value) return props.options.filter((o) => !o.disabled)
  if (props.filterOption === false) return props.options.filter((o) => !o.disabled)
  if (typeof props.filterOption === 'function') {
    const filter = props.filterOption
    return props.options.filter((o) => !o.disabled && filter(searchText.value, o))
  }
  const keyword = searchText.value.toLowerCase()
  return props.options.filter(
    (o) => !o.disabled && (o.label ?? o.value).toLowerCase().includes(keyword),
  )
})

/**
 * 从光标位置向前找出正在输入的提及片段：
 * 前缀必须位于文本开头，或前一个字符是空白/换行。
 */
function resolveMention(text: string, caretPos: number): { start: number; prefix: string; text: string } | null {
  for (let i = caretPos - 1; i >= 0; i--) {
    const char = text[i]
    if (char === '\n' || char === ' ' || char === '\t') return null
    const hit = prefixes.value.find((p) => p && text.startsWith(p, i))
    if (hit) {
      const prev = i > 0 ? text[i - 1] : ''
      if (i !== 0 && prev !== ' ' && prev !== '\n' && prev !== '\t') return null
      // 片段内不能再出现触发前缀，避免 @@a 这种误判
      const segment = text.slice(i + hit.length, caretPos)
      if (segment.includes(hit)) return null
      return { start: i, prefix: hit, text: segment }
    }
  }
  return null
}

/** 用隐藏镜像节点测量光标相对坐标（SSR 与 jsdom 下退化为 0） */
function measureCaret(): { top: number; left: number } {
  const el = textareaRef.value
  if (!el || typeof document === 'undefined' || typeof window === 'undefined') {
    return { top: 0, left: 0 }
  }
  const computedStyle = window.getComputedStyle(el)
  const mirror = document.createElement('div')
  const copied = [
    'boxSizing',
    'width',
    'fontSize',
    'fontFamily',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'textIndent',
    'tabSize',
  ] as const
  for (const key of copied) mirror.style[key] = computedStyle[key]
  mirror.style.position = 'absolute'
  mirror.style.top = '0'
  mirror.style.left = '-9999px'
  mirror.style.visibility = 'hidden'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.overflowWrap = 'break-word'
  mirror.textContent = el.value.slice(0, el.selectionStart ?? 0)

  const marker = document.createElement('span')
  marker.textContent = '\u200b'
  mirror.appendChild(marker)
  document.body.appendChild(mirror)
  const top = marker.offsetTop - el.scrollTop
  const left = marker.offsetLeft - el.scrollLeft
  document.body.removeChild(mirror)
  return { top, left }
}

function syncMentionState(): void {
  const el = textareaRef.value
  if (!el) return
  const pos = el.selectionStart ?? el.value.length
  const hit = resolveMention(el.value, pos)
  if (!hit) {
    close()
    return
  }
  prefixIndex.value = hit.start
  activePrefix.value = hit.prefix
  searchText.value = hit.text
  activeIndex.value = 0
  caret.value = measureCaret()
  if (!open.value) open.value = true
  emit('search', hit.text, hit.prefix)
}

function close(): void {
  open.value = false
  searchText.value = ''
  prefixIndex.value = -1
  activePrefix.value = ''
  activeIndex.value = 0
}

function handleInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  // 输入后光标已移动，等 DOM 同步再解析
  nextTick(syncMentionState)
}

function replaceRange(text: string, start: number, end: number, insert: string): string {
  return text.slice(0, start) + insert + text.slice(end)
}

async function selectOption(option: MentionOption): Promise<void> {
  const el = textareaRef.value
  if (!el || prefixIndex.value < 0) return
  const start = prefixIndex.value
  const end = el.selectionStart ?? el.value.length
  const insert = `${activePrefix.value}${option.value} `
  const nextValue = replaceRange(el.value, start, end, insert)

  emit('update:modelValue', nextValue)
  emit('select', option, activePrefix.value)
  close()

  await nextTick()
  const nextCaret = start + insert.length
  el.focus()
  el.setSelectionRange(nextCaret, nextCaret)
}

function moveActive(step: number): void {
  const list = matchedOptions.value
  if (!list.length) return
  const next = (activeIndex.value + step + list.length) % list.length
  activeIndex.value = next
}

function handleKeydown(event: KeyboardEvent): void {
  if (!open.value || !matchedOptions.value.length) {
    if (event.key === 'Escape') close()
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const option = matchedOptions.value[activeIndex.value]
    if (option) void selectOption(option)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function handleBlur(): void {
  // 延迟关闭，避免点击候选项时面板先消失
  window.setTimeout(close, 120)
}

watch(
  () => props.modelValue,
  () => {
    if (!open.value) return
    nextTick(syncMentionState)
  },
)

const dropdownStyle = computed(() => ({
  top: `${caret.value.top}px`,
  left: `${caret.value.left}px`,
}))
</script>

<template>
  <div class="kb-mentions" :class="{ 'kb-mentions--disabled': disabled }">
    <textarea
      ref="textareaRef"
      class="kb-mentions__input"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-expanded="open"
      :aria-autocomplete="'list'"
      role="combobox"
      aria-haspopup="listbox"
      @input="handleInput"
      @keydown="handleKeydown"
      @click="syncMentionState"
      @blur="handleBlur"
    />
    <div
      v-if="open"
      class="kb-mentions__dropdown"
      :style="dropdownStyle"
      role="listbox"
      aria-label="提及候选"
    >
      <div
        v-for="(option, index) in matchedOptions"
        :key="option.value"
        class="kb-mentions__option"
        :class="{ 'kb-mentions__option--active': index === activeIndex }"
        role="option"
        :aria-selected="index === activeIndex"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.label ?? option.value }}
      </div>
      <div v-if="!matchedOptions.length" class="kb-mentions__empty">{{ notFoundContent }}</div>
    </div>
  </div>
</template>
