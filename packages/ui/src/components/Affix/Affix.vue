<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'

defineOptions({ name: 'KbAffix' })

export interface AffixProps {
  /** 距视口顶部的固定偏移（px），与 offsetBottom 二选一，都传时以 offsetTop 为准 */
  offsetTop?: number
  /** 距视口底部的固定偏移（px） */
  offsetBottom?: number
  /** 固定范围的边界容器（CSS 选择器）；固定不会超出该容器 */
  target?: string
  /** 固定时是否保留占位元素，避免原位置塌陷导致布局跳动，默认 true */
  placeholder?: boolean
}

const props = withDefaults(defineProps<AffixProps>(), {
  offsetTop: 0,
  offsetBottom: undefined,
  target: undefined,
  placeholder: true,
})

const emit = defineEmits<{ change: [fixed: boolean] }>()

const rootEl = ref<HTMLElement | null>(null)
const fixed = ref(false)
const fixedStyle = ref<CSSProperties>({})
/** 占位元素的尺寸，固定后由它撑住原位置 */
const placeholderStyle = ref<CSSProperties>({})

/** 滚动监听源：有 target 时监听最近的滚动容器（简化处理为 window） */
let boundaryEl: HTMLElement | null = null

function resolveBoundary(): HTMLElement | null {
  if (!props.target || typeof document === 'undefined') return null
  return document.querySelector<HTMLElement>(props.target)
}

function update(): void {
  const el = rootEl.value
  if (!el || typeof window === 'undefined') return

  const rect = el.getBoundingClientRect()
  // 宽度随内容走，避免固定后因脱离文档流而收缩
  placeholderStyle.value = { width: `${rect.width}px`, height: `${rect.height}px` }

  const boundaryRect = boundaryEl?.getBoundingClientRect() ?? null

  if (props.offsetBottom !== undefined) {
    const shouldFix = rect.bottom > window.innerHeight - props.offsetBottom
    applyFixed(shouldFix, {
      position: 'fixed',
      bottom: `${props.offsetBottom}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    })
    return
  }

  const shouldFix = rect.top < props.offsetTop
  // 容器已滚过固定线时不再固定，否则元素会溢出容器
  const overBoundary = boundaryRect ? boundaryRect.bottom < props.offsetTop + rect.height : false
  applyFixed(shouldFix && !overBoundary, {
    position: 'fixed',
    top: `${props.offsetTop}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  })
}

function applyFixed(next: boolean, style: CSSProperties): void {
  if (next === fixed.value) {
    if (next) fixedStyle.value = style
    return
  }
  fixed.value = next
  fixedStyle.value = next ? style : {}
  emit('change', next)
}

onMounted(() => {
  boundaryEl = resolveBoundary()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})

/** 外层始终渲染，内层承载固定样式，占位元素负责撑住高度 */
const wrapperStyle = computed<CSSProperties>(() =>
  props.placeholder && fixed.value ? placeholderStyle.value : {},
)
</script>

<template>
  <div ref="rootEl" class="kb-affix" :style="wrapperStyle">
    <div class="kb-affix__inner" :class="{ 'kb-affix__inner--fixed': fixed }" :style="fixed ? fixedStyle : undefined">
      <slot />
    </div>
  </div>
</template>
