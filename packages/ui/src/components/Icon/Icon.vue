<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KbIcon' })

export interface IconProps {
  name: string
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<IconProps>(), { size: 16 })

// 内置图标（24x24 视图，stroke 风格，Lucide 兼容 path）
const ICONS: Record<string, string> = {
  check: 'M20 6 9 17l-5-5',
  close: 'M18 6 6 18M6 6l12 12',
  info: 'M12 16v-4M12 8h.01',
  warning:
    'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  error: 'M18 6 6 18M6 6l12 12',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  'arrow-down': 'M12 5v14M19 12l-7 7-7-7',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  loading:
    'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-up': 'm18 15-6-6-6 6',
  'chevron-left': 'm15 18-6-6 6-6',
  'chevron-right': 'm9 18 6-6-6-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'zoom-in': 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 8v6M8 11h6',
  'zoom-out': 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8 11h6',
  'rotate-cw': 'M21 12a9 9 0 1 1-3.5-7.1M21 3v6h-6',
  'more-horizontal': 'M12 12h.01M19 12h.01M5 12h.01',
}

const pathData = computed(() => ICONS[props.name])
</script>

<template>
  <svg
    class="kb-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :style="color ? { color } : undefined"
    aria-hidden="true"
  >
    <path v-if="pathData" :d="pathData" />
  </svg>
</template>
