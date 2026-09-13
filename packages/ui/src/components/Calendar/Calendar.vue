<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../../composables/useGlobalConfig'
import { defaultLocale } from '../../locale'

defineOptions({ name: 'KbCalendar' })

const { t, locale } = useLocale()

export interface CalendarDay {
  date: Date
  inMonth: boolean
  isSelected: boolean
  /** 落在 [start, end] 开区间内（range 模式） */
  inRange: boolean
  /** 是范围结束日（range 模式） */
  isRangeEnd: boolean
  /** 被额外标记为已选（multiple 模式） */
  isMarked: boolean
}

export interface CalendarProps {
  modelValue?: string
  /** 范围高亮 [start, end]，由 DatePicker 的 range 模式传入 */
  range?: [string, string] | null
  /** 额外高亮日期列表（YYYY-MM-DD），由 DatePicker 的 multiple 模式传入 */
  marked?: string[]
}

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: '',
  range: null,
  marked: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

/** 周一起始的星期缩写；语言包长度不足 7 时回退到默认包，避免渲染错列 */
const weekLabels = computed(() => {
  const shorts = locale.value.calendar.weekShorts
  return Array.isArray(shorts) && shorts.length === 7 ? shorts : defaultLocale.calendar.weekShorts
})

const selected = computed(() => (props.modelValue ? new Date(props.modelValue) : new Date()))
const viewYear = ref(selected.value.getFullYear())
const viewMonth = ref(selected.value.getMonth()) // 0-11

const title = computed(() => t('calendar.title', viewYear.value, viewMonth.value + 1))

function fmt(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** 当月日期格（含补齐的邻月日期） */
const days = computed<CalendarDay[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = (first.getDay() + 6) % 7 // 周一起始
  const start = new Date(viewYear.value, viewMonth.value, 1 - startOffset)
  const rangeStart = props.range?.[0] ?? ''
  const rangeEnd = props.range?.[1] ?? ''
  const list: CalendarDay[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const value = fmt(date)
    list.push({
      date,
      inMonth: date.getMonth() === viewMonth.value,
      isSelected:
        date.getFullYear() === selected.value.getFullYear() &&
        date.getMonth() === selected.value.getMonth() &&
        date.getDate() === selected.value.getDate(),
      // YYYY-MM-DD 定长格式，字符串比较等价于日期比较
      inRange: Boolean(rangeStart && rangeEnd && value > rangeStart && value < rangeEnd),
      isRangeEnd: Boolean(rangeEnd && value === rangeEnd),
      isMarked: props.marked.includes(value),
    })
  }
  return list
})

function selectDay(day: CalendarDay) {
  emit('update:modelValue', fmt(day.date))
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewYear.value--
    viewMonth.value = 11
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewYear.value++
    viewMonth.value = 0
  } else {
    viewMonth.value++
  }
}
</script>

<template>
  <div class="kb-calendar">
    <div class="kb-calendar__header">
      <button
        class="kb-calendar__nav"
        type="button"
        :aria-label="t('calendar.prevMonth')"
        @click="prevMonth"
      >
        ‹
      </button>
      <span class="kb-calendar__title">{{ title }}</span>
      <button
        class="kb-calendar__nav"
        type="button"
        :aria-label="t('calendar.nextMonth')"
        @click="nextMonth"
      >
        ›
      </button>
    </div>
    <div class="kb-calendar__week">
      <span v-for="label in weekLabels" :key="label" class="kb-calendar__week-label">{{ label }}</span>
    </div>
    <div class="kb-calendar__grid">
      <button
        v-for="(day, index) in days"
        :key="index"
        class="kb-calendar__day"
        :class="{
          'kb-calendar__day--outside': !day.inMonth,
          'kb-calendar__day--active': day.isSelected || day.isMarked,
          'kb-calendar__day--in-range': day.inRange,
          'kb-calendar__day--range-end': day.isRangeEnd,
        }"
        type="button"
        @click="selectDay(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
  </div>
</template>
