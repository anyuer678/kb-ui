<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbWatermark' })

export interface WatermarkProps {
  /** 水印文字 */
  text: string
  /** 水印颜色 */
  color?: string
  /** 水印字号 */
  fontSize?: number
  /** 旋转角度 */
  rotate?: number
}

const props = withDefaults(defineProps<WatermarkProps>(), {
  text: '',
  color: 'rgb(0 0 0 / 8%)',
  fontSize: 16,
  rotate: -24,
})

const layerStyle = computed(() => ({
  '--kb-watermark-color': props.color,
  '--kb-watermark-font-size': `${props.fontSize}px`,
  '--kb-watermark-rotate': `${props.rotate}deg`,
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140"><text x="100" y="70" fill="${props.color}" font-size="${props.fontSize}" text-anchor="middle" transform="rotate(${props.rotate} 100 70)">${props.text}</text></svg>`,
  )}")`,
}))
</script>

<template>
  <div class="kb-watermark">
    <div class="kb-watermark__layer" :style="layerStyle" aria-hidden="true" />
    <div class="kb-watermark__content">
      <slot />
    </div>
  </div>
</template>
