<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbSplitter' })

const { t } = useLocale()

export interface SplitterProps {
  /** 各面板的初始占比（百分比），长度即面板数量，默认两栏均分 */
  modelValue?: number[]
  /** 排列方向 */
  layout?: 'horizontal' | 'vertical'
  /** 最小占比（百分比），拖拽不会小于该值 */
  min?: number
  /** 是否禁用拖拽 */
  disabled?: boolean
}

const props = withDefaults(defineProps<SplitterProps>(), {
  modelValue: () => [50, 50],
  layout: 'horizontal',
  min: 10,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: number[]] }>()

/** 当前占比，未受控时用 props 值 */
const sizes = computed(() => props.modelValue)

const rootEl = ref<HTMLDivElement | null>(null)
/** 正在拖拽的分隔条下标 */
const draggingIndex = ref<number | null>(null)

function isHorizontal(): boolean {
  return props.layout === 'horizontal'
}

/** 拖拽中：按鼠标位置换算相邻两个面板的占比 */
function handlePointerMove(event: MouseEvent): void {
  const index = draggingIndex.value
  if (index === null || !rootEl.value) return

  const rect = rootEl.value.getBoundingClientRect()
  const total = isHorizontal() ? rect.width : rect.height
  if (total <= 0) return

  const offset = isHorizontal() ? event.clientX - rect.left : event.clientY - rect.top
  const percent = (offset / total) * 100

  const next = [...sizes.value]
  // 只调整分隔条两侧的两个面板，其余面板占比保持不变
  const pair = next[index] + next[index + 1]
  // percent 是相对整个容器的绝对占比，需减去前面面板的累计占比才是本面板的目标值
  const offsetBefore = next.slice(0, index).reduce((sum, value) => sum + value, 0)
  const desired = percent - offsetBefore
  const first = Math.min(pair - props.min, Math.max(props.min, desired))
  next[index] = first
  next[index + 1] = pair - first

  emit('update:modelValue', next)
}

function stopDrag(): void {
  draggingIndex.value = null
  if (typeof document === 'undefined') return
  document.removeEventListener('mousemove', handlePointerMove)
  document.removeEventListener('mouseup', stopDrag)
}

function startDrag(index: number): void {
  if (props.disabled) return
  draggingIndex.value = index
  document.addEventListener('mousemove', handlePointerMove)
  document.addEventListener('mouseup', stopDrag)
}

onBeforeUnmount(stopDrag)

/** 键盘微调：方向键按 2% 步进，便于无障碍操作 */
function handleBarKeydown(event: KeyboardEvent, index: number): void {
  const step = 2
  const forward = isHorizontal() ? 'ArrowRight' : 'ArrowDown'
  const backward = isHorizontal() ? 'ArrowLeft' : 'ArrowUp'
  if (event.key !== forward && event.key !== backward) return
  event.preventDefault()

  const next = [...sizes.value]
  const delta = event.key === forward ? step : -step
  const pair = next[index] + next[index + 1]
  const first = Math.min(pair - props.min, Math.max(props.min, next[index] + delta))
  next[index] = first
  next[index + 1] = pair - first
  emit('update:modelValue', next)
}

const rootClass = computed(() => [
  'kb-splitter',
  isHorizontal() ? 'kb-splitter--horizontal' : 'kb-splitter--vertical',
  { 'kb-splitter--dragging': draggingIndex.value !== null },
])
</script>

<template>
  <div ref="rootEl" :class="rootClass">
    <template v-for="(size, index) in sizes" :key="index">
      <div class="kb-splitter__pane" :style="{ flexBasis: `${size}%` }">
        <slot :name="`panel-${index}`" :index="index" />
      </div>
      <div
        v-if="index < sizes.length - 1"
        class="kb-splitter__bar"
        :class="{ 'kb-splitter__bar--disabled': disabled }"
        role="separator"
        tabindex="0"
        :aria-label="t('splitter.label')"
        :aria-orientation="isHorizontal() ? 'vertical' : 'horizontal'"
        :aria-valuenow="Math.round(size)"
        aria-valuemin="0"
        aria-valuemax="100"
        @mousedown.prevent="startDrag(index)"
        @keydown="handleBarKeydown($event, index)"
      />
    </template>
  </div>
</template>
