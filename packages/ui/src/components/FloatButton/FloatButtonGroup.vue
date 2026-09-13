<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '../Icon'

defineOptions({ name: 'KbFloatButtonGroup' })

export interface FloatButtonGroupProps {
  /** 展开方向 */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /** 触发方式：点击或悬浮展开 */
  trigger?: 'click' | 'hover'
  /** 是否展开（可用 v-model 双向绑定） */
  open?: boolean
  /** 触发器图标 */
  icon?: string
  /** 触发器形状 */
  shape?: 'circle' | 'square'
  /** 触发器的悬浮提示 */
  tooltip?: string
}

const props = withDefaults(defineProps<FloatButtonGroupProps>(), {
  direction: 'top',
  trigger: 'click',
  open: false,
  icon: 'plus',
  shape: 'circle',
  tooltip: undefined,
})

const emit = defineEmits<{ 'update:open': [open: boolean] }>()

/** 未受控时内部维护展开状态 */
const innerOpen = ref(props.open)

watch(
  () => props.open,
  (value) => {
    innerOpen.value = value
  },
)

const isOpen = computed(() => innerOpen.value)

function setOpen(next: boolean): void {
  innerOpen.value = next
  emit('update:open', next)
}

function toggle(): void {
  setOpen(!innerOpen.value)
}

/** 展开时触发器旋转 45°，形成「加号变叉」的观感 */
const triggerRotation = computed(() => (isOpen.value ? 'rotate(45deg)' : undefined))

function handleMouseEnter(): void {
  if (props.trigger === 'hover') setOpen(true)
}

function handleMouseLeave(): void {
  if (props.trigger === 'hover') setOpen(false)
}
</script>

<template>
  <div
    class="kb-float-button-group"
    :class="[`kb-float-button-group--${direction}`, { 'kb-float-button-group--open': isOpen }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="kb-float-button-group__items">
      <slot />
    </div>
    <button
      class="kb-float-button-group__trigger"
      :class="`kb-float-button-group__trigger--${shape}`"
      type="button"
      :aria-label="tooltip ?? (isOpen ? '收起' : '展开')"
      :aria-expanded="isOpen"
      :title="tooltip"
      @click="toggle"
    >
      <Icon :name="icon" :size="18" :style="{ transform: triggerRotation }" />
    </button>
  </div>
</template>
