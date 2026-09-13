<script setup lang="ts">
import { computed } from 'vue'
import { createQRMatrix, type ECLevelName } from './qrcode'

defineOptions({ name: 'KbQRCode' })

export interface QRCodeProps {
  /** 编码内容（文本 / URL） */
  value: string
  /** 渲染像素尺寸（含静默区），默认 160 */
  size?: number
  /** 错误校正等级，默认 M */
  level?: ECLevelName
  /** 静默区（quiet zone）模块数，默认 4（规范要求 ≥4） */
  margin?: number
  /** 暗模块颜色，默认 #000000 */
  color?: string
  /** 背景（亮模块）颜色，默认 #FFFFFF */
  bgColor?: string
  /** 无障碍替代文本，默认等于 value */
  alt?: string
}

const props = withDefaults(defineProps<QRCodeProps>(), {
  size: 160,
  level: 'M',
  margin: 4,
  color: '#000000',
  bgColor: '#FFFFFF',
})

const result = computed(() => {
  if (!props.value) return null
  try {
    return createQRMatrix(props.value, { level: props.level })
  } catch {
    return null
  }
})

const totalModules = computed(() =>
  result.value ? result.value.moduleCount + props.margin * 2 : 0,
)

/** 将暗模块合并为一条 SVG path（单个 DOM 节点，SSR 安全且高性能） */
const pathData = computed(() => {
  if (!result.value) return ''
  const { modules, moduleCount } = result.value
  const parts: string[] = []
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row * moduleCount + col]) {
        const x = col + props.margin
        const y = row + props.margin
        parts.push(`M${x} ${y}h1v1h-1z`)
      }
    }
  }
  return parts.join('')
})
</script>

<template>
  <div
    v-if="result"
    class="kb-qrcode"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      class="kb-qrcode__svg"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${totalModules} ${totalModules}`"
      shape-rendering="crispEdges"
      role="img"
      :aria-label="alt || value"
    >
      <rect :width="totalModules" :height="totalModules" :fill="bgColor" />
      <path :d="pathData" :fill="color" />
    </svg>
    <div v-if="$slots.default" class="kb-qrcode__icon">
      <slot />
    </div>
  </div>
  <div v-else class="kb-qrcode kb-qrcode--empty" :style="{ width: `${size}px`, height: `${size}px` }">
    <span class="kb-qrcode__placeholder">无效内容</span>
  </div>
</template>
