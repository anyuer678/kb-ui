<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

defineOptions({ name: 'KbAffix' })

export interface AffixProps {
  /** 距视口顶部的固定偏移（px），与 offsetBottom 二选一，都传时以 offsetTop 为准 */
  offsetTop?: number
  /** 距视口底部的固定偏移（px） */
  offsetBottom?: number
  /**
   * 滚动容器 / 固定范围的边界（CSS 选择器）。
   * 传入后：以「容器顶部 + offsetTop」为固定线，并监听该容器的 scroll；
   * 不传则以视口顶部为固定线。固定不会超出该容器。
   */
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

/**
 * target 指向的容器：既是固定范围的边界，也是滚动监听源。
 * 只监听 window 的话，容器内部滚动根本不会触发 update，target 形同虚设。
 */
let targetEl: HTMLElement | null = null

function resolveTarget(): HTMLElement | null {
  if (!props.target || typeof document === 'undefined') return null
  return document.querySelector<HTMLElement>(props.target)
}

function bindTargetScroll(): void {
  targetEl?.removeEventListener('scroll', update)
  targetEl = resolveTarget()
  targetEl?.addEventListener('scroll', update, { passive: true })
}

function update(): void {
  const el = rootEl.value
  if (!el || typeof window === 'undefined') return

  const rect = el.getBoundingClientRect()
  // 宽度随内容走，避免固定后因脱离文档流而收缩
  placeholderStyle.value = { width: `${rect.width}px`, height: `${rect.height}px` }

  const targetRect = targetEl?.getBoundingClientRect() ?? null
  // 有 target 时以「容器顶部 + offsetTop」为固定线；否则以视口顶部为准
  const refTop = (targetRect ? targetRect.top : 0) + props.offsetTop

  if (props.offsetBottom !== undefined) {
    const viewportBottom = targetRect ? targetRect.bottom : window.innerHeight
    const shouldFix = rect.bottom > viewportBottom - props.offsetBottom
    applyFixed(shouldFix, {
      position: 'fixed',
      bottom: `${props.offsetBottom}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    })
    return
  }

  const shouldFix = rect.top < refTop
  // 容器已滚过固定线时不再固定，否则元素会溢出容器
  const overBoundary = targetRect ? targetRect.bottom < refTop + rect.height : false
  applyFixed(shouldFix && !overBoundary, {
    position: 'fixed',
    top: `${refTop}px`,
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
  bindTargetScroll()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
})

// target 可能在运行时变化（比如异步渲染出的容器），重新解析并续接监听
watch(
  () => props.target,
  () => {
    bindTargetScroll()
    update()
  },
)

onBeforeUnmount(() => {
  targetEl?.removeEventListener('scroll', update)
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
