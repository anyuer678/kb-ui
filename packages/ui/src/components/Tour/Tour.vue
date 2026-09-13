<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbTour' })

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TourStep {
  /** 目标元素选择器，如 '#step-1'；不传时气泡居中显示 */
  target?: string
  title: string
  description?: string
  placement?: TourPlacement
}

export interface TourProps {
  /** 是否显示引导 */
  modelValue?: boolean
  steps?: TourStep[]
  current?: number
  /** 是否展示跳过按钮，默认 true */
  showSkip?: boolean
  /** 遮罩是否允许点击关闭 */
  maskClosable?: boolean
}

const props = withDefaults(defineProps<TourProps>(), {
  modelValue: false,
  steps: () => [],
  current: 0,
  showSkip: true,
  maskClosable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:current': [value: number]
  finish: []
  change: [current: number]
}>()

const { t } = useLocale()

const index = ref(props.current)
/** 气泡位置与高亮区域，随目标元素实时计算 */
const bubbleStyle = ref<Record<string, string>>({})
const highlightStyle = ref<Record<string, string>>({})

const step = computed<TourStep | undefined>(() => props.steps[index.value])
const isFirst = computed(() => index.value === 0)
const isLast = computed(() => index.value >= props.steps.length - 1)

watch(
  () => props.current,
  (value) => {
    index.value = value
  },
)

/** 计算气泡与高亮框位置 */
async function updatePosition(): Promise<void> {
  await nextTick()
  const current = step.value
  if (!current) return

  const el = current.target ? document.querySelector<HTMLElement>(current.target) : null
  const placement = current.placement ?? 'bottom'

  if (!el) {
    // 无目标时居中展示
    highlightStyle.value = { display: 'none' }
    bubbleStyle.value = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
    return
  }

  const rect = el.getBoundingClientRect()
  const GAP = 12
  highlightStyle.value = {
    display: 'block',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }

  const style: Record<string, string> = {}
  if (placement === 'top') {
    style.top = `${rect.top - GAP}px`
    style.left = `${rect.left + rect.width / 2}px`
    style.transform = 'translate(-50%, -100%)'
  } else if (placement === 'left') {
    style.top = `${rect.top + rect.height / 2}px`
    style.left = `${rect.left - GAP}px`
    style.transform = 'translate(-100%, -50%)'
  } else if (placement === 'right') {
    style.top = `${rect.top + rect.height / 2}px`
    style.left = `${rect.left + rect.width + GAP}px`
    style.transform = 'translateY(-50%)'
  } else {
    style.top = `${rect.top + rect.height + GAP}px`
    style.left = `${rect.left + rect.width / 2}px`
    style.transform = 'translateX(-50%)'
  }
  bubbleStyle.value = style
}

watch([() => props.modelValue, index], () => {
  if (props.modelValue) updatePosition()
})

watch(
  () => props.modelValue,
  (value) => {
    if (typeof window === 'undefined') return
    if (value) {
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    } else {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  },
)

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})

function close(): void {
  emit('update:modelValue', false)
}

function goTo(next: number): void {
  index.value = next
  emit('update:current', next)
  emit('change', next)
}

function next(): void {
  if (isLast.value) {
    emit('finish')
    close()
    return
  }
  goTo(index.value + 1)
}

function prev(): void {
  if (isFirst.value) return
  goTo(index.value - 1)
}

function handleMaskClick(): void {
  if (props.maskClosable) close()
}
</script>

<template>
  <Teleport to="body" :disabled="!modelValue">
    <div v-if="modelValue" class="kb-tour">
      <div class="kb-tour__mask" @click="handleMaskClick" />
      <div class="kb-tour__highlight" :style="highlightStyle" />
      <div class="kb-tour__bubble" :style="bubbleStyle" role="dialog" aria-modal="true">
        <button class="kb-tour__close" type="button" :aria-label="t('tour.close')" @click="close">
          <Icon name="close" :size="14" />
        </button>
        <h4 class="kb-tour__title">{{ step?.title }}</h4>
        <p v-if="step?.description" class="kb-tour__description">{{ step.description }}</p>
        <div class="kb-tour__footer">
          <span class="kb-tour__progress">{{ index + 1 }} / {{ steps.length }}</span>
          <div class="kb-tour__actions">
            <button v-if="showSkip" class="kb-tour__btn" type="button" @click="close">
              {{ t('tour.skip') }}
            </button>
            <button v-if="!isFirst" class="kb-tour__btn" type="button" @click="prev">
              {{ t('tour.prev') }}
            </button>
            <button class="kb-tour__btn kb-tour__btn--primary" type="button" @click="next">
              {{ isLast ? t('tour.finish') : t('tour.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
