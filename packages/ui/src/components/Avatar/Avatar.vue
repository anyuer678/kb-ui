<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbAvatar' })

export interface AvatarProps {
  /** 图片地址 */
  src?: string
  alt?: string
  /** 无图时显示的文字（如名字首字符） */
  fallback?: string
  /** 尺寸：数字为 px；预设 small/medium/large */
  size?: number | 'small' | 'medium' | 'large'
  /** 圆形 */
  round?: boolean
}

const props = withDefaults(defineProps<AvatarProps>(), {
  src: '',
  alt: '',
  fallback: '',
  size: 'medium',
  round: false,
})

const SIZE_MAP: Record<string, string> = {
  small: '28px',
  medium: '40px',
  large: '56px',
}

const classes = computed(() => [
  'kb-avatar',
  typeof props.size === 'string' ? `kb-avatar--${props.size}` : '',
  { 'kb-avatar--round': props.round },
])

const sizeStyle = computed(() => {
  if (typeof props.size === 'number') {
    return { width: `${props.size}px`, height: `${props.size}px`, fontSize: `${props.size / 2}px` }
  }
  const px = SIZE_MAP[props.size]
  return { width: px, height: px }
})

const showImage = computed(() => Boolean(props.src))
const showFallback = computed(() => !props.src && Boolean(props.fallback))
</script>

<template>
  <span :class="classes" :style="sizeStyle">
    <img v-if="showImage" class="kb-avatar__img" :src="src" :alt="alt" />
    <span v-else-if="showFallback" class="kb-avatar__fallback">{{ fallback }}</span>
    <Icon v-else class="kb-avatar__icon" name="menu" :size="'50%'" />
  </span>
</template>
