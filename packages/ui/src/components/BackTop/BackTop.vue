<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbBackTop' })

export interface BackTopProps {
  /** 滚动距离超过该值时显示按钮 */
  visibilityHeight?: number
  /** 滚动监听目标：CSS 选择器或元素，默认监听 window */
  target?: string | HTMLElement
  /** 距视口右侧的距离（px） */
  right?: number
  /** 距视口底部的距离（px） */
  bottom?: number
  /** 回到顶部的动画时长（ms），0 表示直接跳转 */
  duration?: number
}

const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 200,
  target: undefined,
  right: 40,
  bottom: 40,
  duration: 300,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { t } = useLocale()

const visible = ref(false)
/** 实际监听的滚动源，挂载时解析 */
let scrollSource: Window | HTMLElement | null = null
let frameId = 0

/** 当前滚动位置，兼容 window 与普通元素 */
function readScrollTop(): number {
  if (!scrollSource) return 0
  if (scrollSource instanceof Element) return scrollSource.scrollTop
  return scrollSource.scrollY
}

function syncVisible(): void {
  visible.value = readScrollTop() >= props.visibilityHeight
}

/** 解析滚动源：未指定 target 时用 window；选择器无匹配则退化为 null */
function resolveSource(): Window | HTMLElement | null {
  if (typeof window === 'undefined') return null
  if (!props.target) return window
  if (typeof props.target === 'string') return document.querySelector<HTMLElement>(props.target)
  return props.target
}

function writeScrollTop(value: number): void {
  if (!scrollSource) return
  if (scrollSource instanceof Element) scrollSource.scrollTop = value
  else scrollSource.scrollTo(0, value)
}

/** easeOutCubic：先快后慢，观感更贴近原生滚动 */
function easeOutCubic(ratio: number): number {
  return 1 - Math.pow(1 - ratio, 3)
}

function scrollToTop(): void {
  if (!scrollSource) return
  const start = readScrollTop()
  if (start <= 0) return

  // 无动画能力（SSR 或显式 duration<=0）时直接归零
  if (props.duration <= 0 || typeof requestAnimationFrame === 'undefined') {
    writeScrollTop(0)
    return
  }

  const begin = performance.now()
  const step = (now: number): void => {
    const ratio = Math.min(1, (now - begin) / props.duration)
    writeScrollTop(Math.round(start * (1 - easeOutCubic(ratio))))
    if (ratio < 1) frameId = requestAnimationFrame(step)
  }
  frameId = requestAnimationFrame(step)
}

function handleClick(event: MouseEvent): void {
  scrollToTop()
  emit('click', event)
}

onMounted(() => {
  scrollSource = resolveSource()
  if (!scrollSource) return
  scrollSource.addEventListener('scroll', syncVisible, { passive: true })
  syncVisible()
})

onBeforeUnmount(() => {
  scrollSource?.removeEventListener('scroll', syncVisible)
  if (frameId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frameId)
})

const buttonStyle = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}))
</script>

<template>
  <Transition name="kb-backtop-fade">
    <button
      v-if="visible"
      class="kb-backtop"
      type="button"
      :style="buttonStyle"
      :aria-label="t('backTop.label')"
      @click="handleClick"
    >
      <slot>
        <Icon name="arrow-up" :size="18" />
      </slot>
    </button>
  </Transition>
</template>
