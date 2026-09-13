<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue'
import {
  provideGlobalConfig,
  type ComponentSize,
  type GlobalConfig,
  type ThemeMode,
} from '../../composables/useGlobalConfig'
import { defaultLocale, getLocale, type ProjectLocale } from '../../locale'
import type { LocaleName } from '../../locale'

defineOptions({ name: 'KbConfigProvider' })

export interface ConfigProviderProps {
  /** 语言包对象或语言名（`'zh-CN'` / `'en-US'`），默认 zh-CN */
  locale?: ProjectLocale | LocaleName
  /** 组件统一尺寸，组件自身的 size 会覆盖此值，默认 medium */
  size?: ComponentSize
  /** 弹层基础层级，默认 2000 */
  zIndex?: number
  /** 主题模式，dark 时给 `<html>` 加 data-theme="dark"，默认 light */
  theme?: ThemeMode
}

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  locale: undefined,
  size: 'medium',
  zIndex: 2000,
  theme: 'light',
})

const resolvedLocale = computed<ProjectLocale>(() =>
  typeof props.locale === 'string' ? getLocale(props.locale) : (props.locale ?? defaultLocale),
)

// reactive 而非 computed —— provide 需要保持对象引用稳定以维持响应性，
// 内部字段由下面的 watchEffect 跟随 props 同步
const config = reactive<GlobalConfig>({
  locale: resolvedLocale.value,
  size: props.size,
  zIndex: props.zIndex,
  theme: props.theme,
})

watchEffect(() => {
  config.locale = resolvedLocale.value
  config.size = props.size
  config.zIndex = props.zIndex
  config.theme = props.theme
})

provideGlobalConfig(config)

// 主题落到 <html> 上，因此处样式表用 [data-theme='dark'] 命中
watchEffect(() => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (props.theme === 'dark') root.setAttribute('data-theme', 'dark')
  else if (root.getAttribute('data-theme') === 'dark') root.removeAttribute('data-theme')
})
</script>

<template>
  <slot />
</template>
