<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '../Icon'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbImagePreview' })

export interface ImagePreviewProps {
  /** 是否显示预览 */
  visible?: boolean
  /** 图片地址列表 */
  images?: string[]
  /** 当前显示第几张（从 0 开始） */
  index?: number
  /** 挂载位置，默认 body */
  teleportTo?: string
}

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  visible: false,
  images: () => [],
  index: 0,
  teleportTo: 'body',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:index': [value: number]
  close: []
  change: [index: number]
}>()

const { t } = useLocale()

const current = ref(props.index)
const scale = ref(1)
const rotate = ref(0)
const MIN_SCALE = 0.25
const MAX_SCALE = 5

watch(
  () => props.index,
  (value) => {
    current.value = value
  },
)

// 每次打开都重置缩放与旋转，避免残留上一次的状态
watch(
  () => props.visible,
  (value) => {
    if (!value) return
    scale.value = 1
    rotate.value = 0
    current.value = props.index
  },
)

const hasMultiple = computed(() => props.images.length > 1)
const currentSrc = computed(() => props.images[current.value] ?? '')
/** 多图时隐藏切换按钮 + 计数 */
const counterText = computed(() => `${current.value + 1} / ${props.images.length}`)

const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotate.value}deg)`,
}))

function close(): void {
  emit('update:visible', false)
  emit('close')
}

function goTo(next: number): void {
  const total = props.images.length
  if (!total) return
  current.value = (next + total) % total
  emit('update:index', current.value)
  emit('change', current.value)
}

function prev(): void {
  goTo(current.value - 1)
}

function next(): void {
  goTo(current.value + 1)
}

function zoom(delta: number): void {
  const value = scale.value + delta
  scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(value.toFixed(2))))
}

function handleWheel(event: WheelEvent): void {
  // 滚轮缩放：向下缩小、向上放大
  zoom(event.deltaY > 0 ? -0.15 : 0.15)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowLeft' && hasMultiple.value) prev()
  else if (event.key === 'ArrowRight' && hasMultiple.value) next()
  else if (event.key === '=' || event.key === '+') zoom(0.2)
  else if (event.key === '-') zoom(-0.2)
}

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.visible,
  (value) => {
    if (typeof document === 'undefined') return
    if (value) document.addEventListener('keydown', handleKeydown)
    else document.removeEventListener('keydown', handleKeydown)
  },
  { immediate: true },
)
</script>

<template>
  <Teleport :to="teleportTo" :disabled="!visible">
    <div
      v-if="visible"
      class="kb-image-preview"
      role="dialog"
      aria-modal="true"
      :aria-label="t('image.previewDialog')"
      @click.self="close"
      @wheel.prevent="handleWheel"
    >
      <button
        class="kb-image-preview__close"
        type="button"
        :aria-label="t('common.close')"
        @click="close"
      >
        <Icon name="close" :size="18" />
      </button>

      <button
        v-if="hasMultiple"
        class="kb-image-preview__nav kb-image-preview__nav--prev"
        type="button"
        :aria-label="t('image.prev')"
        @click.stop="prev"
      >
        <Icon name="chevron-left" :size="20" />
      </button>

      <img class="kb-image-preview__image" :src="currentSrc" :style="imageStyle" alt="" />

      <button
        v-if="hasMultiple"
        class="kb-image-preview__nav kb-image-preview__nav--next"
        type="button"
        :aria-label="t('image.next')"
        @click.stop="next"
      >
        <Icon name="chevron-right" :size="20" />
      </button>

      <div class="kb-image-preview__toolbar" @click.stop>
        <button type="button" :aria-label="t('image.zoomOut')" @click="zoom(-0.25)">
          <Icon name="zoom-out" :size="16" />
        </button>
        <button type="button" :aria-label="t('image.zoomIn')" @click="zoom(0.25)">
          <Icon name="zoom-in" :size="16" />
        </button>
        <button type="button" :aria-label="t('image.rotate')" @click="rotate += 90">
          <Icon name="rotate-cw" :size="16" />
        </button>
        <span v-if="hasMultiple" class="kb-image-preview__counter">{{ counterText }}</span>
      </div>
    </div>
  </Teleport>
</template>
