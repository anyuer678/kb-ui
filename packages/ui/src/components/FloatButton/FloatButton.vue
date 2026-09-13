<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbFloatButton' })

export interface FloatButtonProps {
  /** 类型（语义色） */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  /** 形状 */
  shape?: 'circle' | 'square'
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 图标名（见 Icon 组件）；与默认插槽二选一 */
  icon?: string
  /** 文字描述，显示在图标下方 */
  description?: string
  /** 悬浮提示 */
  tooltip?: string
  /** 传入后渲染为链接 <a> */
  href?: string
  /** 链接打开方式，配合 href 使用 */
  target?: '_self' | '_blank'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<FloatButtonProps>(), {
  type: 'default',
  shape: 'circle',
  size: 'default',
  icon: undefined,
  description: undefined,
  tooltip: undefined,
  href: undefined,
  target: '_blank',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

/** 无障碍名称：优先 tooltip，其次描述，最后给一个通用标注 */
const ariaLabel = computed(() => props.tooltip ?? props.description ?? undefined)

function handleClick(event: MouseEvent): void {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const rootClass = computed(() => [
  // type 与 size 都有 default 值，同名修饰类会互相撞车；default 不生成修饰类，由基础样式承载
  ...(props.type === 'default' ? [] : [`kb-float-button--${props.type}`]),
  `kb-float-button--${props.shape}`,
  `kb-float-button--${props.size}`,
  {
    'kb-float-button--disabled': props.disabled,
    'kb-float-button--loading': props.loading,
    'kb-float-button--with-description': Boolean(props.description),
  },
])
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="kb-float-button"
    :class="rootClass"
    :href="href || undefined"
    :target="href ? target : undefined"
    :type="href ? undefined : 'button'"
    :disabled="href ? undefined : disabled"
    :aria-label="ariaLabel"
    :aria-busy="loading || undefined"
    :aria-disabled="disabled || undefined"
    :title="tooltip"
    @click="handleClick"
  >
    <Icon v-if="loading" name="loading" class="kb-float-button__spin" :size="16" />
    <Icon v-else-if="icon" :name="icon" :size="16" />
    <span v-else class="kb-float-button__content"><slot /></span>
    <span v-if="description" class="kb-float-button__description">{{ description }}</span>
  </component>
</template>
