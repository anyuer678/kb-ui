<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'KbSelect' })

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  modelValue?: string | number
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  placeholder: '',
  disabled: false,
  size: 'medium',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const open = ref(false)
const triggerEl = ref<HTMLDivElement | null>(null)
const panelId = `kb-select-${Math.random().toString(36).slice(2, 8)}`
const activeIndex = ref(-1)

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? '',
)

const enabledIndexes = computed(() =>
  props.options.reduce<number[]>((acc, o, i) => (o.disabled ? acc : (acc.push(i), acc)), []),
)

const activeOptionId = computed(() =>
  open.value && activeIndex.value >= 0 ? `${panelId}-opt-${activeIndex.value}` : undefined,
)

const classes = computed(() => [
  'kb-select',
  `kb-select--${props.size}`,
  {
    'kb-select--open': open.value,
    'kb-select--disabled': props.disabled,
  },
])

function scrollActiveIntoView(): void {
  void nextTick(() => {
    const el = document.getElementById(activeOptionId.value ?? '')
    el?.scrollIntoView?.({ block: 'nearest' })
  })
}

function openPanel(focus: 'first' | 'selected'): void {
  open.value = true
  const selIdx = props.options.findIndex((o) => o.value === props.modelValue)
  if (focus === 'selected' && selIdx >= 0 && !props.options[selIdx].disabled) {
    activeIndex.value = selIdx
  } else {
    activeIndex.value = enabledIndexes.value[0] ?? -1
  }
  scrollActiveIntoView()
}

function closePanel(): void {
  open.value = false
  activeIndex.value = -1
}

function toggle() {
  if (props.disabled) return
  open.value ? closePanel() : openPanel('selected')
}

function moveActive(delta: 1 | -1): void {
  const enabled = enabledIndexes.value
  if (!enabled.length) return
  let idx = activeIndex.value
  do {
    idx += delta
  } while (idx >= 0 && idx < props.options.length && props.options[idx].disabled)
  if (idx >= 0 && idx < props.options.length) {
    activeIndex.value = idx
    scrollActiveIntoView()
  }
}

function moveEdge(last: boolean): void {
  const enabled = enabledIndexes.value
  if (!enabled.length) return
  activeIndex.value = last ? enabled[enabled.length - 1] : enabled[0]
  scrollActiveIntoView()
}

function commitActive(): void {
  const option = props.options[activeIndex.value]
  if (option) selectOption(option)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      open.value ? commitActive() : openPanel('selected')
      break
    case 'ArrowDown':
      event.preventDefault()
      open.value ? moveActive(1) : openPanel('selected')
      break
    case 'ArrowUp':
      event.preventDefault()
      open.value ? moveActive(-1) : openPanel('selected')
      break
    case 'Home':
      event.preventDefault()
      if (open.value) moveEdge(false)
      break
    case 'End':
      event.preventDefault()
      if (open.value) moveEdge(true)
      break
    case 'Escape':
      event.preventDefault()
      closePanel()
      break
    case 'Tab':
      closePanel()
      break
  }
}

function selectOption(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  closePanel()
}

function handleOutsideClick(event: MouseEvent) {
  if (triggerEl.value && !triggerEl.value.contains(event.target as Node)) {
    closePanel()
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<template>
  <div ref="triggerEl" :class="classes">
    <div
      class="kb-select__trigger"
      role="combobox"
      tabindex="0"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-activedescendant="activeOptionId"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="kb-select__value" :class="{ 'kb-select__placeholder': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <span class="kb-select__arrow" aria-hidden="true">▾</span>
    </div>
    <div v-if="open" :id="panelId" class="kb-select__panel" role="listbox">
      <div
        v-for="(option, i) in options"
        :id="`${panelId}-opt-${i}`"
        :key="option.value"
        class="kb-select__option"
        :class="{
          'kb-select__option--active': i === activeIndex,
          'kb-select__option--selected': option.value === modelValue,
          'kb-select__option--disabled': option.disabled,
        }"
        role="option"
        :aria-selected="option.value === modelValue"
        :aria-disabled="option.disabled || undefined"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
