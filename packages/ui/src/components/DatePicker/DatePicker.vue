<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar } from '../Calendar'

defineOptions({ name: 'KbDatePicker' })

export type DatePickerMode = 'single' | 'range' | 'multiple'

export interface DatePickerProps {
  /** single 模式为字符串；range 模式为 [start, end]；multiple 模式为日期数组 */
  modelValue?: string | string[]
  /** 选择模式：单日期 / 日期范围 / 多日期 */
  mode?: DatePickerMode
  placeholder?: string
  /** range 模式的起止分隔符 */
  separator?: string
  disabled?: boolean
  /** 是否显示清空按钮 */
  clearable?: boolean
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: '',
  mode: 'single',
  placeholder: '',
  separator: ' 至 ',
  disabled: false,
  clearable: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()

const open = ref(false)
/** range 模式：第一次点击的起点，等待第二次点击收口 */
const pendingStart = ref('')

const isRange = computed(() => props.mode === 'range')
const isMultiple = computed(() => props.mode === 'multiple')

const values = computed<string[]>(() => {
  if (Array.isArray(props.modelValue)) return [...props.modelValue]
  return props.modelValue ? [props.modelValue] : []
})

/** 面板锚点：取首个已选日期，保证打开时落在已选月份 */
const anchorValue = computed(() => values.value[0] ?? '')

const rangeValue = computed<[string, string] | null>(() => {
  if (!isRange.value || values.value.length < 2) return null
  return [values.value[0], values.value[1]]
})

const displayText = computed(() => {
  const list = values.value
  if (isRange.value) {
    if (!list.length) return ''
    return list.length === 1
      ? `${list[0]}${props.separator}`
      : `${list[0]}${props.separator}${list[1]}`
  }
  if (isMultiple.value) return list.length ? `已选 ${list.length} 个日期` : ''
  return list[0] ?? ''
})

const placeholderText = computed(() => {
  if (props.placeholder) return props.placeholder
  if (isRange.value) return '选择日期范围'
  if (isMultiple.value) return '选择日期（可多选）'
  return '选择日期'
})

const hasValue = computed(() => values.value.length > 0)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (!open.value) return
  // range 模式重新打开时，若已存在半截区间（只有起点），沿用为待收口起点
  pendingStart.value = isRange.value && values.value.length === 1 ? values.value[0] : ''
}

function clear() {
  emit('update:modelValue', isRange.value || isMultiple.value ? [] : '')
  pendingStart.value = ''
  open.value = false
}

function onSelect(date: string) {
  if (isMultiple.value) {
    const next = values.value.includes(date)
      ? values.value.filter((item) => item !== date)
      : [...values.value, date].sort()
    emit('update:modelValue', next)
    return
  }

  if (isRange.value) {
    if (!pendingStart.value) {
      pendingStart.value = date
      emit('update:modelValue', [date])
      return
    }
    // 定长 YYYY-MM-DD，字符串比较即日期比较；倒序点击时自动交换
    const [start, end] =
      pendingStart.value <= date ? [pendingStart.value, date] : [date, pendingStart.value]
    pendingStart.value = ''
    emit('update:modelValue', [start, end])
    open.value = false
    return
  }

  emit('update:modelValue', date)
  open.value = false
}
</script>

<template>
  <div class="kb-datepicker">
    <input
      class="kb-datepicker__input"
      :class="{
        'kb-datepicker__input--wide': mode === 'range',
        'kb-datepicker__input--disabled': disabled,
      }"
      :value="displayText"
      :placeholder="placeholderText"
      :disabled="disabled"
      readonly
      @click="toggle"
    />
    <button
      v-if="clearable && hasValue"
      class="kb-datepicker__clear"
      type="button"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button>
    <div v-if="open" class="kb-datepicker__panel">
      <Calendar
        :model-value="anchorValue"
        :range="rangeValue"
        :marked="isMultiple ? values : []"
        @update:model-value="onSelect"
      />
    </div>
  </div>
</template>
