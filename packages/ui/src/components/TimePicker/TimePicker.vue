<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbTimePicker' })

export interface TimePickerProps {
  /** 时间字符串，如 '09:30' 或 '09:30:00' */
  modelValue?: string
  /** 展示与录入格式，默认 'HH:mm'；含 ss 时启用秒列 */
  format?: string
  /** 占位文案，不传时取语言包中的 `timePicker.placeholder` */
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  /** 分钟步长，默认 1 */
  minuteStep?: number
}

const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: '',
  format: 'HH:mm',
  placeholder: '',
  disabled: false,
  clearable: false,
  minuteStep: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const { t } = useLocale()

/** 面板的稳定 id，供选择框的 aria-controls 引用（ARIA 1.2 要求 combobox 必须带该属性） */
const panelId = `kb-timepicker-${Math.random().toString(36).slice(2, 8)}`

const open = ref(false)
const rootEl = ref<HTMLDivElement | null>(null)

/** 是否展示秒列 */
const withSeconds = computed(() => props.format.includes('ss'))

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

const hourOptions = computed(() => Array.from({ length: 24 }, (_, i) => pad(i)))
const minuteOptions = computed(() => {
  const step = Math.max(1, Math.floor(props.minuteStep))
  const list: string[] = []
  for (let i = 0; i < 60; i += step) list.push(pad(i))
  return list
})
const secondOptions = computed(() => Array.from({ length: 60 }, (_, i) => pad(i)))

/** 解析当前值为 [时, 分, 秒] */
const parsed = computed<[string, string, string]>(() => {
  const parts = (props.modelValue || '').split(':')
  return [parts[0] ?? '00', parts[1] ?? '00', parts[2] ?? '00']
})

const displayText = computed(
  () => props.modelValue || props.placeholder || t('timePicker.placeholder'),
)
const showClear = computed(() => props.clearable && !!props.modelValue && !props.disabled)

/** 选取某一列后拼回完整时间串 */
function pick(index: 0 | 1 | 2, value: string): void {
  const parts = [...parsed.value] as [string, string, string]
  parts[index] = value
  const next = withSeconds.value ? parts.join(':') : parts.slice(0, 2).join(':')
  emit('update:modelValue', next)
  emit('change', next)
}

function clear(): void {
  emit('update:modelValue', '')
  emit('change', '')
}

function handleOutside(event: MouseEvent): void {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) open.value = false
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') open.value = false
}

function toggle(): void {
  if (props.disabled) return
  open.value = !open.value
}

onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))
</script>

<template>
  <div ref="rootEl" class="kb-timepicker">
    <div
      class="kb-timepicker__control"
      :class="{ 'kb-timepicker__control--disabled': disabled }"
      role="combobox"
      tabindex="0"
      :aria-expanded="open"
      :aria-label="t('timePicker.label')"
      :aria-controls="panelId"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="kb-timepicker__text" :class="{ 'kb-timepicker__text--placeholder': !modelValue }">
        {{ displayText }}
      </span>
      <span v-if="showClear" class="kb-timepicker__clear" role="button" :aria-label="t('common.clear')" @click.stop="clear">
        <Icon name="close" :size="14" />
      </span>
      <span class="kb-timepicker__arrow">▾</span>
    </div>

    <div v-if="open" :id="panelId" class="kb-timepicker__panel">
      <div class="kb-timepicker__column" role="listbox" :aria-label="t('timePicker.hour')">
        <div
          v-for="item in hourOptions"
          :key="item"
          class="kb-timepicker__option"
          :class="{ 'kb-timepicker__option--active': item === parsed[0] }"
          role="option"
          :aria-selected="item === parsed[0]"
          @click="pick(0, item)"
        >
          {{ item }}
        </div>
      </div>
      <div class="kb-timepicker__column" role="listbox" :aria-label="t('timePicker.minute')">
        <div
          v-for="item in minuteOptions"
          :key="item"
          class="kb-timepicker__option"
          :class="{ 'kb-timepicker__option--active': item === parsed[1] }"
          role="option"
          :aria-selected="item === parsed[1]"
          @click="pick(1, item)"
        >
          {{ item }}
        </div>
      </div>
      <div v-if="withSeconds" class="kb-timepicker__column" role="listbox" :aria-label="t('timePicker.second')">
        <div
          v-for="item in secondOptions"
          :key="item"
          class="kb-timepicker__option"
          :class="{ 'kb-timepicker__option--active': item === parsed[2] }"
          role="option"
          :aria-selected="item === parsed[2]"
          @click="pick(2, item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
