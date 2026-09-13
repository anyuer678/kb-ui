<script setup lang="ts">
import { computed, ref } from 'vue'
import { ImagePreview } from '../ImagePreview'
import { useLocale } from '../../composables/useGlobalConfig'

defineOptions({ name: 'KbImage' })

export interface ImageProps {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  /** 是否允许点击打开预览，默认 true */
  preview?: boolean
  /** 预览时的图片列表（多图可切换），默认只预览当前图 */
  previewList?: string[]
  /** 图片填充方式 */
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  /** 加载失败时展示的替代图地址 */
  fallback?: string
}

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  width: undefined,
  height: undefined,
  preview: true,
  previewList: undefined,
  fit: 'fill',
  fallback: undefined,
})

const { t } = useLocale()

const failed = ref(false)
const previewVisible = ref(false)
/** 预览定位到当前图 */
const previewIndex = ref(0)

const images = computed(() => props.previewList ?? [props.src])
const currentSrc = computed(() => (failed.value && props.fallback ? props.fallback : props.src))

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

function handleError(): void {
  failed.value = true
}

function openPreview(): void {
  if (!props.preview || failed.value) return
  previewIndex.value = Math.max(0, images.value.indexOf(props.src))
  previewVisible.value = true
}
</script>

<template>
  <div class="kb-image" :style="containerStyle" :class="{ 'kb-image--previewable': preview && !failed }">
    <img
      class="kb-image__inner"
      :src="currentSrc"
      :alt="alt"
      :style="{ objectFit: fit }"
      @error="handleError"
      @click="openPreview"
    />
    <div v-if="failed" class="kb-image__error" role="img" :aria-label="t('image.loadFailed')">
      <slot name="error">{{ t('image.loadFailed') }}</slot>
    </div>
    <div v-else-if="preview" class="kb-image__mask" role="button" :aria-label="t('image.preview')" @click="openPreview">
      <slot name="mask">
        <span class="kb-image__preview-text">{{ t('image.preview') }}</span>
      </slot>
    </div>

    <ImagePreview
      v-if="preview"
      v-model:visible="previewVisible"
      v-model:index="previewIndex"
      :images="images"
    />
  </div>
</template>
